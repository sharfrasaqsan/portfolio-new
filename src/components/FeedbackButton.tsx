import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, CheckCircle2, Loader2 } from "lucide-react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when opened & handle Escape key
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, "feedback"), {
        feedback: feedback.trim(),
        email: email.trim() || "anonymous",
        path: window.location.pathname,
        userAgent: navigator.userAgent,
        createdAt: serverTimestamp(),
      });
      setIsSent(true);
      setFeedback("");
      setEmail("");
      setTimeout(() => {
        setIsSent(false);
        setIsOpen(false);
      }, 2400);
    } catch (err) {
      console.error("Failed to send feedback", err);
      alert(
        "Unable to transmit note. Please reach out directly via contact form.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 print:hidden">
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-panel-title"
          className="absolute bottom-12 right-0 w-80 sm:w-88 max-w-[calc(100vw-2rem)] bg-[#FFFFFF]/98 dark:bg-[#171F24]/98 backdrop-blur-md rounded-lg shadow-xl border border-[#E5E4DE] dark:border-[#27313A] overflow-hidden p-5 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {isSent ? (
            <div className="py-6 text-center space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3
                id="feedback-panel-title"
                className="text-sm font-bold text-[#171F24] dark:text-[#F1F4F6]"
              >
                Feedback Received
              </h3>
              <p className="text-xs text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
                Thank you for your thoughts. Your note was recorded directly to
                the console.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Header */}
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E5E4DE] dark:border-[#27313A]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#1F51D0] dark:bg-[#4F7FF7]" />
                  <h3
                    id="feedback-panel-title"
                    className="text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]"
                  >
                    Direct Feedback
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6] p-1 rounded-sm cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="fb-note-input"
                  className="block text-[11px] font-mono uppercase tracking-wider text-[#55626F] dark:text-[#97A3AF] mb-1"
                >
                  Your thoughts or note *
                </label>
                <textarea
                  id="fb-note-input"
                  ref={textareaRef}
                  required
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Suggestions, questions, or bug reports..."
                  className="w-full px-3 py-2 text-xs rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] focus:outline-none focus:ring-1 focus:ring-[#1F51D0] dark:focus:ring-[#4F7FF7] resize-none placeholder:text-[#55626F]/60"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label
                  htmlFor="fb-email-input"
                  className="block text-[11px] font-mono uppercase tracking-wider text-[#55626F] dark:text-[#97A3AF] mb-1"
                >
                  Your Email (Optional)
                </label>
                <input
                  id="fb-email-input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] focus:outline-none focus:ring-1 focus:ring-[#1F51D0] dark:focus:ring-[#4F7FF7] placeholder:text-[#55626F]/60"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending || !feedback.trim()}
                className="w-full py-2.5 px-3 bg-[#1F51D0] dark:bg-[#4F7FF7] hover:bg-[#1942AA] dark:hover:bg-[#3D6CE5] text-white rounded-md text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Direct Note</span>
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={
          isOpen
            ? "Close direct feedback widget"
            : "Open direct feedback widget"
        }
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFFFFF]/90 dark:bg-[#171F24]/90 backdrop-blur-sm text-[#171F24] dark:text-[#F1F4F6] border border-[#E5E4DE] dark:border-[#27313A] shadow-md hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] hover:border-[#1F51D0]/40 transition-all text-xs font-medium cursor-pointer"
      >
        {isOpen ? (
          <>
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Close</span>
          </>
        ) : (
          <>
            <MessageSquare
              className="w-3.5 h-3.5 text-[#1F51D0] dark:text-[#4F7FF7]"
              aria-hidden="true"
            />
            <span>Feedback</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FeedbackButton;
