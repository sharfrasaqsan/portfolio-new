import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Github,
  Layers,
  Wrench,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import {
  absoluteUrl,
  resolveImageUrl,
  buildBreadcrumbsSchema,
} from "../../utils/seo";

const Contact = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType =
    searchParams.get("type") === "advisory" ? "advisory" : "project";
  const initialService = searchParams.get("service") || "";

  const [inquiryType, setInquiryType] = useState<"project" | "advisory">(
    initialType,
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    consultationTopic: "Core Web Vitals & Performance Audit",
    service: initialService || "Enterprise Web & Intranet Modernization",
    timeline: "Immediate (Next 2-4 weeks)",
    budget: "$2,500 – $5,000",
    message: "",
  });

  const [status, setStatus] = useState<null | "sending" | "success" | "error">(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const urlType = searchParams.get("type");
    if (urlType === "advisory") setInquiryType("advisory");
    else if (urlType === "project" || urlType === "client")
      setInquiryType("project");

    const urlService = searchParams.get("service");
    if (urlService) {
      setFormData((prev) => ({ ...prev, service: urlService }));
    }
  }, [searchParams]);

  const handleTypeSwitch = (type: "project" | "advisory") => {
    setInquiryType(type);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("type", type);
      return p;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setErrorMessage(
        "Contact service credentials not detected. Please contact directly via email.",
      );
      setStatus("error");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setErrorMessage("Please complete all required fields before submitting.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      // Build structured message summary
      const compiledDetails = [
        `[INQUIRY TYPE: ${
          inquiryType === "project"
            ? "Client Project Engagement"
            : "Technical Advisory & Consultation"
        }]`,
        formData.company ? `Organization: ${formData.company.trim()}` : null,
        inquiryType === "project"
          ? `Scope of Work: ${formData.service}`
          : `Advisory Topic: ${formData.consultationTopic}`,
        `Target Timeline: ${formData.timeline}`,
        inquiryType === "project"
          ? `Estimated Budget: ${formData.budget}`
          : null,
        `\n--- Detailed Message ---`,
        formData.message.trim(),
      ]
        .filter(Boolean)
        .join("\n");

      const templateParams = {
        from_name: formData.name.trim(),
        from_email: formData.email.trim(),
        message: compiledDetails,
        to_name: "Mohamed Sharfiras",
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        consultationTopic: "Core Web Vitals & Performance Audit",
        service: "Enterprise Web & Intranet Modernization",
        timeline: "Immediate (Next 2-4 weeks)",
        budget: "$2,500 – $5,000",
        message: "",
      });
    } catch (err: any) {
      console.error("EmailJS Error:", err);
      const msg =
        err?.text ||
        err?.message ||
        "Transmission failed. Your message was preserved so you can retry.";
      setErrorMessage(msg);
      setStatus("error");
    }
  };

  const canonicalUrl = absoluteUrl("/contact");

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      <Helmet>
        <title>Contact Mohamed Sharfiras — Web Developer</title>
        <meta
          name="description"
          content="Discuss an enterprise intranet migration, high-performance web platform, or technical consultation with Mohamed Sharfiras. Based in Colombo, Sri Lanka."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:title"
          content="Contact Mohamed Sharfiras — Web Developer"
        />
        <meta
          property="og:description"
          content="Discuss an enterprise web migration, technical consultation, or client project with Mohamed Sharfiras."
        />
        <meta property="og:image" content={resolveImageUrl(null)} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(
            buildBreadcrumbsSchema([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          )}
        </script>
      </Helmet>

      {/* Header Introduction */}
      <section className="space-y-3 border-b border-[#E5E4DE] dark:border-[#27313A] pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
          Inquiries &amp; Collaboration
        </p>
        <h1 className="fluid-h1 font-extrabold text-[#171F24] dark:text-[#F1F4F6] tracking-tight">
          Discuss a project or consultation.
        </h1>
        <p className="text-sm sm:text-base text-[#55626F] dark:text-[#97A3AF] max-w-2xl leading-relaxed">
          Available for specialized enterprise intranet consulting,
          high-performance web development, and technical audits. Select your
          inquiry type below for streamlined routing.
        </p>
      </section>

      {/* Contact Grid: Details & Accessible Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Direct Channels */}
        <aside className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-5 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6] pb-2 border-b border-[#E5E4DE] dark:border-[#27313A]">
              Direct Channels
            </h2>

            <div>
              <p className="text-xs font-mono uppercase text-[#55626F] dark:text-[#97A3AF] flex items-center gap-1.5">
                <Mail
                  className="w-3.5 h-3.5 text-[#1F51D0] dark:text-[#4F7FF7]"
                  aria-hidden="true"
                />
                <span>Email</span>
              </p>
              <a
                href="mailto:sharfrasaqsan@gmail.com"
                className="text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6] hover:text-[#1F51D0] dark:hover:text-[#4F7FF7] transition-colors break-all mt-0.5 block"
              >
                sharfrasaqsan@gmail.com
              </a>
            </div>

            <div>
              <p className="text-xs font-mono uppercase text-[#55626F] dark:text-[#97A3AF] flex items-center gap-1.5">
                <Phone
                  className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span>Phone / WhatsApp</span>
              </p>
              <a
                href="https://wa.me/94751230001"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mt-0.5 block"
              >
                +94 751 230 001
              </a>
            </div>

            <div>
              <p className="text-xs font-mono uppercase text-[#55626F] dark:text-[#97A3AF] flex items-center gap-1.5">
                <MapPin
                  className="w-3.5 h-3.5 text-[#55626F] dark:text-[#97A3AF]"
                  aria-hidden="true"
                />
                <span>Location</span>
              </p>
              <p className="text-sm font-semibold text-[#171F24] dark:text-[#F1F4F6] mt-0.5">
                Havelock City / Colombo, Sri Lanka
              </p>
              <p className="text-xs text-[#55626F] dark:text-[#97A3AF] mt-0.5">
                Remote collaboration worldwide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/sharfiras/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-h-[44px] py-2 px-3 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Linkedin
                className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]"
                aria-hidden="true"
              />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/sharfrasaqsan"
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-h-[44px] py-2 px-3 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </div>
        </aside>

        {/* Right Column: Accessible Form with Topic Switcher */}
        <section className="md:col-span-7">
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Direct inquiry form"
            className="p-6 sm:p-8 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-6 shadow-2xs"
          >
            {/* Inquiry Journey Switcher */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6]">
                Inquiry Focus:
              </label>
              <div className="grid grid-cols-2 p-1 rounded-md bg-[#F2F1EC] dark:bg-[#222B33] border border-[#E5E4DE] dark:border-[#27313A]">
                <button
                  type="button"
                  onClick={() => handleTypeSwitch("project")}
                  className={`py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    inquiryType === "project"
                      ? "bg-[#FFFFFF] dark:bg-[#171F24] text-[#1F51D0] dark:text-[#4F7FF7] shadow-xs"
                      : "text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Project / Client Build</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeSwitch("advisory")}
                  className={`py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    inquiryType === "advisory"
                      ? "bg-[#FFFFFF] dark:bg-[#171F24] text-[#1F51D0] dark:text-[#4F7FF7] shadow-xs"
                      : "text-[#55626F] dark:text-[#97A3AF] hover:text-[#171F24] dark:hover:text-[#F1F4F6]"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Technical Advisory &amp; Audit</span>
                </button>
              </div>
            </div>

            {/* Live Status Announcements for screen readers */}
            <div role="status" aria-live="polite">
              {status === "success" && (
                <div className="p-4 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold">Message delivered successfully.</p>
                    <p className="text-xs mt-0.5">
                      Thank you for getting in touch. I will review your inquiry
                      shortly.
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle
                    className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold">Message could not be sent.</p>
                    <p className="text-xs mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] mb-1"
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="e.g. sarah@enterprise.com"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                  />
                </div>
              </div>

              {/* Company / Brand */}
              <div>
                <label
                  htmlFor="contact-company"
                  className="block text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] mb-1"
                >
                  Organization / Brand Name
                </label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="e.g. Horizon Digital or Self"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                />
              </div>

              {/* Dynamic Project Fields */}
              {inquiryType === "project" && (
                <>
                  <div>
                    <label
                      htmlFor="contact-service"
                      className="block text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] mb-1"
                    >
                      Primary Service Required
                    </label>
                    <select
                      id="contact-service"
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({ ...formData, service: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                    >
                      <option value="Enterprise Web & Intranet Modernization">
                        Enterprise Web &amp; Intranet Modernization
                      </option>
                      <option value="Core Web Vitals & Technical SEO Remediation">
                        Core Web Vitals &amp; Technical SEO Remediation
                      </option>
                      <option value="Custom React & Next.js Application Engineering">
                        Custom React &amp; Next.js Application Engineering
                      </option>
                      <option value="WordPress / Headless Web Platform">
                        WordPress / Headless Web Platform
                      </option>
                      <option value="Other Custom Project">
                        Other Custom Engineering Requirement
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-timeline"
                        className="block text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] mb-1"
                      >
                        Target Timeline
                      </label>
                      <select
                        id="contact-timeline"
                        value={formData.timeline}
                        onChange={(e) =>
                          setFormData({ ...formData, timeline: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      >
                        <option value="Immediate (Next 2-4 weeks)">
                          Immediate (Next 2-4 weeks)
                        </option>
                        <option value="1 – 2 months">1 – 2 months</option>
                        <option value="3+ months out">3+ months out</option>
                        <option value="Flexible / Exploratory">
                          Flexible / Exploratory
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-budget"
                        className="block text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] mb-1"
                      >
                        Estimated Budget Bracket
                      </label>
                      <select
                        id="contact-budget"
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData({ ...formData, budget: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                      >
                        <option value="Under $2,500">Under $2,500</option>
                        <option value="$2,500 – $5,000">$2,500 – $5,000</option>
                        <option value="$5,000 – $10,000">
                          $5,000 – $10,000
                        </option>
                        <option value="Enterprise $10,000+">
                          Enterprise $10,000+
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Dynamic Advisory Fields */}
              {inquiryType === "advisory" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] mb-1"
                    >
                      Consultation Topic
                    </label>
                    <select
                      id="contact-topic"
                      value={formData.consultationTopic}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          consultationTopic: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                    >
                      <option value="Core Web Vitals & Performance Audit">
                        Core Web Vitals &amp; Performance Audit
                      </option>
                      <option value="Frontend Architecture & Codebase Review">
                        Frontend Architecture &amp; Code Review
                      </option>
                      <option value="Enterprise Intranet Migration Strategy">
                        Enterprise Intranet Migration Strategy
                      </option>
                      <option value="General Technical Consultation">
                        General Technical Consultation
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-timeline-advisory"
                      className="block text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] mb-1"
                    >
                      Target Timeline
                    </label>
                    <select
                      id="contact-timeline-advisory"
                      value={formData.timeline}
                      onChange={(e) =>
                        setFormData({ ...formData, timeline: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0]"
                    >
                      <option value="Immediate (Next 1-2 weeks)">
                        Immediate (Next 1-2 weeks)
                      </option>
                      <option value="Next 2-4 weeks">Next 2-4 weeks</option>
                      <option value="Flexible / Exploratory">
                        Flexible / Exploratory
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-[#171F24] dark:text-[#F1F4F6] mb-1"
                >
                  {inquiryType === "project"
                    ? "Project Summary & Requirements"
                    : "Consultation Details & Questions"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  aria-required="true"
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder={
                    inquiryType === "project"
                      ? "Briefly describe your website, technical challenges (e.g. Core Web Vitals, migration goals), and any existing infrastructure..."
                      : "Describe your technical questions, codebase details, or specific architectural advisory requirements..."
                  }
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FBFBFA] dark:bg-[#13171B] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F51D0] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full min-h-[44px] py-3 px-4 rounded-md bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] text-xs sm:text-sm font-semibold hover:bg-[#27313A] dark:hover:bg-[#E5E4DE] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#1F51D0]"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting inquiry...</span>
                </>
              ) : (
                <>
                  <span>
                    {inquiryType === "project"
                      ? "Submit Project Consultation Request"
                      : "Send Advisory Request"}
                  </span>
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
