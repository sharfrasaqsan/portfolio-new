import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { db } from '../../firebase/config';
import { Plus, Edit2, Trash2, X, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Draft');
  const [category, setCategory] = useState('Technology');
  const [images, setImages] = useState<string[]>([]);
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'blogs'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setBlogs(data);
    });
    return () => unsub();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploading(true);
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Please configure Cloudinary environment variables first.");
      setIsUploading(false);
      return;
    }

    const uploadedUrls: string[] = [];
    try {
      for(let i = 0; i < files.length; i++){
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        
        uploadedUrls.push(response.data.secure_url);
      }
      setImages((prev: string[]) => [...prev, ...uploadedUrls]);
    } catch(err: any) {
      console.error(err);
      alert("Error uploading to Cloudinary: " + (err.response?.data?.error?.message || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary not configured.");
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      
      const url = response.data.secure_url;
      insertMarkdown(`![Image](${url})`, '');
    } catch(err: any) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev: string[]) => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title, excerpt, content, status, images, category,
        coverImage: images.length > 0 ? images[0] : '', // maintain compatibility
        updatedAt: serverTimestamp()
      };
      if (editId) {
        await updateDoc(doc(db, 'blogs', editId), payload);
      } else {
        await addDoc(collection(db, 'blogs'), { ...payload, createdAt: serverTimestamp() });
      }
      closeModal();
    } catch (err: any) {
      console.error(err);
      alert("Error saving blog post: " + err.message);
    }
  };

  const openEdit = (b: any) => {
    setEditId(b.id); setTitle(b.title); setExcerpt(b.excerpt || ''); setContent(b.content || '');
    setStatus(b.status || 'Draft'); 
    setImages(b.images ? b.images : (b.coverImage ? [b.coverImage] : []));
    setCategory(b.category || 'Technology');
    setIsModalOpen(true);
  };

  const confirmDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      await deleteDoc(doc(db, 'blogs', id));
    }
  };

  const closeModal = () => {
    setEditId(null); setTitle(''); setExcerpt(''); setContent(''); setStatus('Draft'); setCategory('Technology');
    setImages([]); setIsModalOpen(false);
  };

   const insertMarkdown = (prefix: string, suffix: string = '') => {
     const textarea = document.getElementById('blogContent') as HTMLTextAreaElement;
     if (!textarea) return;

     const start = textarea.selectionStart;
     const end = textarea.selectionEnd;
     const text = textarea.value;
     const before = text.substring(0, start);
     const after = text.substring(end, text.length);
     const selection = text.substring(start, end);

     const newContent = before + prefix + selection + suffix + after;
     setContent(newContent);
     
     // Set focus back and selection
     setTimeout(() => {
       textarea.focus();
       textarea.setSelectionRange(start + prefix.length, end + prefix.length);
     }, 0);
   };

  return (
    <div className="space-y-6 flex-1 w-full mx-auto max-w-7xl">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          <Plus className="w-5 h-5" /> <span>Add Post</span>
        </button>
      </div>

      <div className="space-y-4">
        {blogs.map(b => (
          <motion.div key={b.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
            
            <div className="w-full sm:w-48 h-32 sm:h-auto bg-gray-100 relative shrink-0">
               {b.images?.length > 0 || b.coverImage ? (
                 <img src={b.images?.[0] || b.coverImage} className="w-full h-full object-cover" alt="" />
               ) : (
                 <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
               )}
            </div>

            <div className="p-5 flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{b.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${b.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {b.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{b.excerpt}</p>
            </div>
            
            <div className="border-t sm:border-t-0 sm:border-l border-gray-100 flex sm:flex-col shrink-0">
              <button onClick={() => openEdit(b)} className="flex-1 py-3 px-6 sm:py-0 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => confirmDelete(b.id)} className="flex-1 py-3 px-6 sm:py-0 flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors border-l sm:border-l-0 sm:border-t border-gray-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {blogs.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             No blog posts created yet.
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
            <motion.div initial={{scale:0.95, opacity: 0}} animate={{scale:1, opacity: 1}} exit={{scale:0.95, opacity: 0}} className="bg-white rounded-xl max-w-4xl w-full shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
              
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-xl">
                 <h2 className="text-2xl font-bold">{editId ? 'Edit Post' : 'Add New Post'}</h2>
                 <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 overflow-y-auto">
                <form id="blogForm" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <label className="text-sm font-medium mb-1 block">Title</label>
                      <input required value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Category</label>
                      <input required value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Status</label>
                      <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50">
                        <option>Published</option><option>Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium block">Blog Gallery / Header Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      {images.map((img, idx) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group bg-white">
                            <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                      ))}
                      <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-500 transition-colors bg-white">
                          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                          {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-600" /> : <UploadCloud className="w-6 h-6 text-gray-400" />}
                          <span className="text-xs text-gray-500 mt-2">{isUploading ? 'Uploading...' : 'Browse files'}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Excerpt</label>
                    <input required value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" />
                  </div>
                   <div>
                    <label className="text-sm font-medium mb-1 block flex items-center justify-between">
                       <span>Content</span>
                       <span className="text-xs text-gray-500 font-normal">Markdown is fully supported.</span>
                    </label>
                    <div className="border rounded-t-lg bg-gray-100 dark:bg-gray-800 p-2 flex flex-wrap gap-2 border-b-0">
                      <button type="button" onClick={() => insertMarkdown('## ')} className="px-3 py-1 bg-white hover:bg-gray-50 rounded text-xs font-bold border shadow-sm">H2</button>
                      <button type="button" onClick={() => insertMarkdown('### ')} className="px-3 py-1 bg-white hover:bg-gray-50 rounded text-xs font-bold border shadow-sm">H3</button>
                      <button type="button" onClick={() => insertMarkdown('**', '**')} className="px-3 py-1 bg-white hover:bg-gray-50 rounded text-xs font-bold border shadow-sm">Bold</button>
                      <button type="button" onClick={() => insertMarkdown('*', '*')} className="px-3 py-1 bg-white hover:bg-gray-50 rounded text-xs italic border shadow-sm">Italic</button>
                      <button type="button" onClick={() => insertMarkdown('- ')} className="px-3 py-1 bg-white hover:bg-gray-50 rounded text-xs border shadow-sm">List</button>
                      <button type="button" onClick={() => insertMarkdown('[', '](url)')} className="px-3 py-1 bg-white hover:bg-gray-50 rounded text-xs border shadow-sm">Link</button>
                      <button type="button" onClick={() => insertMarkdown('> ')} className="px-3 py-1 bg-white hover:bg-gray-50 rounded text-xs border shadow-sm">Quote</button>
                      <button type="button" onClick={() => insertMarkdown('```\n', '\n```')} className="px-3 py-1 bg-white hover:bg-gray-50 rounded text-xs border shadow-sm">Code</button>
                      <label className="px-3 py-1 bg-white hover:bg-gray-50 rounded text-xs border shadow-sm cursor-pointer flex items-center gap-1">
                        {isUploading ? (
                          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                        ) : (
                          <ImageIcon className="w-3 h-3" />
                        )}
                        <span>{isUploading ? 'Uploading...' : 'Image'}</span>
                        <input type="file" hidden accept="image/*" onChange={handleContentImageUpload} disabled={isUploading} />
                      </label>
                    </div>
                    <textarea id="blogContent" required rows={12} value={content} onChange={(e)=>setContent(e.target.value)} className="w-full border rounded-b-lg p-4 bg-gray-50 font-mono text-sm leading-relaxed outline-none focus:ring-1 focus:ring-blue-500" placeholder="# Write your amazing post here..." />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-xl shrink-0">
                <button type="button" onClick={closeModal} className="px-5 py-2 hover:bg-gray-200 rounded-lg transition font-medium text-gray-700">Cancel</button>
                <button type="submit" form="blogForm" disabled={isUploading} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50">{editId ? 'Update' : 'Save'} Post</button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
