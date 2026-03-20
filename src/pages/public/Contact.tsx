import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<null | 'sending' | 'success' | 'error'>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Using a simple timeout to simulate network request since there's no backend mailer yet
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <Helmet>
        <title>Contact | Alex Walker</title>
        <meta name="description" content="Reach out to me for business inquiries, projects, or just to say hi!" />
      </Helmet>

      <div className="grid md:grid-cols-2 gap-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Let's talk</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              I'm always interested in hearing about new projects, opportunities, or just an interesting technical challenge. Drop me a line!
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Me at</p>
                <a href="mailto:hello@example.com" className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">hello@example.com</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-lg font-bold text-gray-900">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center space-x-2">
              <MessageCircle className="w-6 h-6" /> <span>Send a Message</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-400 bg-gray-50 focus:bg-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-400 bg-gray-50 focus:bg-white" placeholder="john@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-400 bg-gray-50 focus:bg-white resize-none" placeholder="How can I help you?" />
              </div>
            </div>
            <button disabled={status === 'sending'} type="submit" className="w-full bg-gray-900 text-white rounded-xl py-4 font-bold tracking-wide hover:bg-gray-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-75">
              <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
              <Send className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-4 left-6 right-6 bg-green-500 text-white px-4 py-3 rounded-xl font-medium text-center shadow-lg">
                  Message sent successfully! I'll be in touch soon.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
