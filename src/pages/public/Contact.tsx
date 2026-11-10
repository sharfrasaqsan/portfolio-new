import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  MessageCircle,
  AlertCircle,
  Phone,
  Github,
  Linkedin,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<null | "sending" | "success" | "error">(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      alert("EmailJS is not configured. Please add the environment variables.");
      return;
    }

    setStatus("sending");

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: "Mohamed Sharfiras",
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      console.error("EmailJS Error:", err);
      const errorMsg = err?.text || err?.message || "Something went wrong";
      alert("EmailJS error: " + errorMsg);
      setStatus("error");
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <Helmet>
        <title>
          Contact Mohamed Sharfiras | Enterprise Web & Frontend Developer
        </title>
        <meta
          name="description"
          content="Get in touch with Mohamed Sharfiras for web development projects, enterprise intranet migrations, React/Next.js builds, or technical SEO inquiries."
        />
      </Helmet>

      <div className="grid md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              Get in Touch
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              Let’s build something impactful.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Whether you need to architect an enterprise intranet, scale a
              high-traffic eCommerce store, optimize web performance, or build a
              bespoke web application, I’m ready to collaborate.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Email Address
                </p>
                <a
                  href="mailto:sharfrasaqsan@gmail.com"
                  className="text-base font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
                >
                  sharfrasaqsan@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Phone & WhatsApp
                </p>
                <a
                  href="https://wa.me/94751230001"
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-bold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  +94 751 230 001
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Location
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  Havelock City / Colombo, Sri Lanka
                </p>
                <p className="text-xs text-gray-500">
                  Available for hybrid, remote & worldwide roles
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://www.linkedin.com/in/sharfiras"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-semibold text-gray-800 dark:text-gray-200 transition"
            >
              <Linkedin className="w-4 h-4 text-blue-600" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/sharfrasaqsan"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-semibold text-gray-800 dark:text-gray-200 transition"
            >
              <Github className="w-4 h-4 text-gray-900 dark:text-white" />
              <span>GitHub</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 relative"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center space-x-2 text-gray-900 dark:text-white">
              <MessageCircle className="w-6 h-6 text-blue-600" />{" "}
              <span>Send a Direct Message</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-900"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-900"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-900 resize-none"
                  placeholder="Tell me about your project, goals, or role..."
                />
              </div>
            </div>
            <button
              disabled={status === "sending"}
              type="submit"
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl py-4 font-bold tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-75 shadow-lg shadow-gray-200 dark:shadow-none"
            >
              <span>
                {status === "sending" ? "Sending..." : "Send Message"}
              </span>
              <Send className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-4 left-0 right-0 bg-green-500 text-white p-4 rounded-xl font-bold text-center shadow-xl z-20"
                >
                  Message sent successfully! 🚀
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-4 left-0 right-0 bg-red-500 text-white p-4 rounded-xl font-bold text-center shadow-xl z-20 flex items-center justify-center space-x-2"
                >
                  <AlertCircle className="w-5 h-5" />{" "}
                  <span>Failed to send. Try again?</span>
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
