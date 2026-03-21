import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { db } from '../../firebase/config';
import { Plus, Edit2, Trash2, X, UploadCloud, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [whyBuilt, setWhyBuilt] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [timeToBuild, setTimeToBuild] = useState('');
  const [category, setCategory] = useState('Web App');
  const [techStack, setTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [type, setType] = useState('Individual Project');
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(data);
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
      alert("Please configure Cloudinary environment variables (VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET) first.");
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

  const removeImage = (index: number) => {
    setImages((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title, shortDesc, fullDesc, whyBuilt, lessonLearned, status, timeToBuild, category, images, featured, type,
        image: images.length > 0 ? images[0] : '', // backwards compatibility
        techStack: techStack.split(',').map(s => s.trim()).filter(Boolean), 
        githubUrl, liveUrl,
        updatedAt: serverTimestamp()
      };
      if (editId) {
        await updateDoc(doc(db, 'projects', editId), payload);
      } else {
        await addDoc(collection(db, 'projects'), { ...payload, createdAt: serverTimestamp() });
      }
      closeModal();
    } catch (err: any) {
      console.error(err);
      alert("Error saving project: " + err.message);
    }
  };

  const openEdit = (p: any) => {
    setEditId(p.id); setTitle(p.title || ''); setShortDesc(p.shortDesc || ''); setFullDesc(p.fullDesc || '');
    setWhyBuilt(p.whyBuilt || ''); setLessonLearned(p.lessonLearned || '');
    setStatus(p.status || 'In Progress'); setTimeToBuild(p.timeToBuild || ''); setCategory(p.category || 'Web App');
    
    // Support legacy 'image' string or new 'images' array
    setImages(p.images ? p.images : (p.image ? [p.image] : []));
    setFeatured(p.featured || false);
    setType(p.type || 'Individual Project');
    setTechStack(p.techStack?.join(', ') || ''); setGithubUrl(p.githubUrl || ''); setLiveUrl(p.liveUrl || '');
    setIsModalOpen(true);
  };

  const confirmDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  const closeModal = () => {
    setEditId(null); setTitle(''); setShortDesc(''); setFullDesc(''); setWhyBuilt(''); setLessonLearned('');
    setStatus('In Progress'); setTimeToBuild(''); setCategory('Web App'); setImages([]); setFeatured(false); setType('Individual Project');
    setTechStack(''); setGithubUrl(''); setLiveUrl(''); setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 flex-1 w-full mx-auto max-w-7xl">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold">Manage Projects</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          <Plus className="w-5 h-5" /> <span>Add Project</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
            {p.featured && <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full z-10">FEATURED</span>}
            <div className="h-32 bg-gray-100 relative">
               {p.images?.length > 0 || p.image ? (
                 <img src={p.images?.[0] || p.image} className="w-full h-full object-cover" alt="" />
               ) : (
                 <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
               )}
            </div>
            <div className="p-5 flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{p.title}</h3>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {p.status}
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{p.type || 'Individual'}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{p.shortDesc}</p>
            </div>
            <div className="border-t border-gray-50 flex">
              <button onClick={() => openEdit(p)} className="flex-1 py-3 flex justify-center text-blue-600 hover:bg-blue-50 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => confirmDelete(p.id)} className="flex-1 py-3 flex justify-center text-red-600 hover:bg-red-50 transition-colors border-l border-gray-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <div className="col-span-3 text-center py-12 text-gray-500 bg-white rounded-xl">No projects found.</div>}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="bg-white rounded-xl max-w-4xl w-full shadow-2xl my-8 relative flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-xl">
                 <h2 className="text-2xl font-bold">{editId ? 'Edit Project' : 'Add New Project'}</h2>
                 <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="projectForm" onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="text-sm font-medium mb-1 block">Title</label><input required value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" /></div>
                    <div><label className="text-sm font-medium mb-1 block">Category</label><input required value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" placeholder="e.g. Web App, Mobile" /></div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Status</label>
                      <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50">
                        <option>Live</option><option>In Progress</option><option>Archived</option>
                      </select>
                    </div>
                    <div><label className="text-sm font-medium mb-1 block">Building Time</label><input value={timeToBuild} onChange={(e)=>setTimeToBuild(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" placeholder="e.g. 2 weeks" /></div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Project Type</label>
                      <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50">
                        <option>Individual Project</option>
                        <option>Freelance Project</option>
                        <option>Company Project</option>
                        <option>Collaborative</option>
                        <option>Open Source</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Short Description</label><textarea required rows={2} value={shortDesc} onChange={(e)=>setShortDesc(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" /></div>
                    
                    <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Tech Stack (comma separated)</label><input value={techStack} onChange={(e)=>setTechStack(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" placeholder="React, Firebase..." /></div>
                    
                    {/* Image Upload Area */}
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-sm font-medium block">Project Images (Upload Multiple)</label>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                           <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                             <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                             <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                               <X className="w-3 h-3" />
                             </button>
                           </div>
                        ))}
                        <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-colors">
                           <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                           {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-600" /> : <UploadCloud className="w-6 h-6 text-gray-400" />}
                           <span className="text-xs text-gray-500 mt-2">{isUploading ? 'Uploading...' : 'Add Images'}</span>
                        </label>
                      </div>
                    </div>

                    <div><label className="text-sm font-medium mb-1 block">GitHub Link</label><input value={githubUrl} onChange={(e)=>setGithubUrl(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" /></div>
                    <div><label className="text-sm font-medium mb-1 block">Live Demo Link</label><input value={liveUrl} onChange={(e)=>setLiveUrl(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" /></div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2 cursor-pointer p-4 border rounded-xl bg-gray-50 hover:bg-gray-100">
                        <input type="checkbox" checked={featured} onChange={(e)=>setFeatured(e.target.checked)} className="w-5 h-5 rounded text-gray-900 border-gray-300 focus:ring-gray-900" />
                        <span className="font-bold">Feature on Homepage</span>
                      </label>
                    </div>

                    <div className="md:col-span-2 border-t pt-6 mt-2"><h3 className="font-bold text-lg mb-4">Deep Dive Details</h3></div>
                    
                    <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Full Description</label><textarea rows={5} value={fullDesc} onChange={(e)=>setFullDesc(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" /></div>
                    <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Why I Built This</label><textarea rows={3} value={whyBuilt} onChange={(e)=>setWhyBuilt(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" /></div>
                    <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Mistake / Lesson Learned</label><textarea rows={3} value={lessonLearned} onChange={(e)=>setLessonLearned(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50" /></div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-xl shrink-0">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 hover:bg-gray-200 rounded-lg transition font-medium text-gray-700">Cancel</button>
                <button type="submit" form="projectForm" disabled={isUploading} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium shadow-lg shadow-gray-200 disabled:opacity-50">{editId ? 'Update' : 'Save'} Project</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
