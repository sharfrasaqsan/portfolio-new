import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Layout,
  Terminal,
  Award,
  GraduationCap,
  Download,
  Building2,
  CheckCircle2,
  Languages as LanguagesIcon,
  Globe,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const skills = [
  {
    name: "Enterprise Web & Intranets",
    icon: Building2,
    desc: "Large-scale migrations on WordPress and SharePoint, strict multi-stage release cycles (Dev, UAT, Pre-deployment, Production), content integrity verification, and Jira defect tracking.",
  },
  {
    name: "Frontend Engineering",
    icon: Layout,
    desc: "React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Framer Motion, modular component architecture, accessibility (a11y), and mobile-first responsive UI.",
  },
  {
    name: "CMS & High-Traffic eCommerce",
    icon: Database,
    desc: "Magento 2, WordPress, WooCommerce, Shopify, custom theme components, payment gateway integrations (PayPal, Stripe), and conversion-focused architectures.",
  },
  {
    name: "Technical SEO & Performance",
    icon: Terminal,
    desc: "Core Web Vitals optimization, schema markup (JSON-LD), on-page SEO, code splitting, image compression, caching strategies, and +30% organic traffic gains.",
  },
  {
    name: "Automation & CRM Integration",
    icon: Code2,
    desc: "GoHighLevel (GHL) workflows with AI-driven triggers, pipeline automation, CI/CD release management, RESTful APIs, and cross-platform integrations.",
  },
];

const technicalSkills = [
  {
    category: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Bootstrap",
      "jQuery",
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      "Node.js",
      "Express.js",
      "RESTful APIs",
      "JWT Authentication",
      "Firebase (Auth, Firestore, Storage)",
      "Supabase",
    ],
  },
  {
    category: "CMS & eCommerce",
    items: [
      "WordPress",
      "SharePoint",
      "Magento 2",
      "WooCommerce",
      "Shopify",
      "GoHighLevel (GHL)",
    ],
  },
  {
    category: "Databases",
    items: ["MongoDB", "MySQL", "Firestore"],
  },
  {
    category: "DevOps & Tooling",
    items: [
      "Git",
      "GitHub",
      "Bitbucket",
      "CI/CD Pipelines",
      "Vite",
      "Jira",
      "Cloudinary",
    ],
  },
  {
    category: "SEO, Testing & Practices",
    items: [
      "Technical SEO",
      "On-Page SEO",
      "Core Web Vitals",
      "Google Search Console",
      "Ahrefs",
      "UAT & Regression Testing",
      "Content Migration",
      "Agile/Scrum",
    ],
  },
];

const experiences = [
  {
    role: "Web Production Officer",
    company: "GSC, HSBC (via TempServe)",
    location: "Havelock City, Colombo, Sri Lanka",
    period: "Aug 2026 – Present",
    highlights: [
      "Build and migrate large volumes of pages for the global enterprise intranet on WordPress and SharePoint, driving deployments across Dev, UAT, pre-pilot, pre-deployment, and production.",
      "Execute rigorous content migration and quality validation, guaranteeing layout fidelity, link integrity, and strict adherence to release specifications.",
      "Test, diagnose, and resolve cross-environment defects, identifying root causes during intensive UAT and pre-deployment cycles.",
      "Track and coordinate tasks and defects in Jira alongside testers, content owners, and project leads to maintain on-time milestone delivery.",
      "Operate within a governed multi-stage release pipeline supporting flawless handovers through to live production.",
    ],
  },
  {
    role: "Web Developer",
    company: "Versus Law",
    location: "Rajagiriya, Colombo | Manchester, UK (Remote)",
    period: "Oct 2025 – Aug 2026",
    highlights: [
      "Engineered and customized high-conversion WordPress and custom JavaScript applications, elevating digital experience and client conversion rates in the legal sector.",
      "Architected and automated CRM workflows in GoHighLevel (GHL) with AI-powered triggers, cutting manual lead processing latency and accelerating pipeline velocity.",
      "Implemented comprehensive on-page and technical SEO strategies (structured data schema, metadata, and Core Web Vitals) boosting organic search presence.",
      "Managed end-to-end development, testing, and deployment cycles using modern CI/CD workflows for reliable releases.",
      "Enforced rigorous mobile-first responsiveness and cross-browser consistency across all client properties.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Oscar Wylee (via Cloud Atlantic International Group)",
    location: "Sydney, AU (Remote)",
    period: "Sep 2022 – Sep 2025",
    highlights: [
      "Developed and maintained high-traffic omnichannel eCommerce web pages using Magento 2 and WordPress for a leading Australian retail brand.",
      "Spearheaded targeted SEO optimization and performance initiatives that drove a 30% increase in organic search traffic.",
      "Reduced average page load time by 15% through strategic code refactoring, intelligent lazy loading, asset compression, and browser caching.",
      "Boosted mobile performance scores by 25% by implementing mobile-first responsive architecture and comprehensive device testing.",
      "Collaborated in Agile/Scrum sprints with international UX designers, product managers, and backend engineers to deploy high-impact features on schedule.",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "KINIT",
    location: "Kinniya, Sri Lanka",
    period: "Dec 2021 – Jun 2022",
    highlights: [
      "Contributed to frontend development of client web applications using HTML5, CSS3, and modern JavaScript, building accessible and compliant UI components.",
      "Engineered reusable React.js components, reducing duplicate development effort and improving team codebase maintainability.",
      "Supported web performance audits, reducing load times and improving overall end-user experience.",
    ],
  },
];

const certifications = [
  {
    title: "Introduction to Front-End Development",
    issuer: "Meta (via Coursera)",
    date: "May 2023",
  },
  {
    title: "ReactJS for Beginners",
    issuer: "Simplilearn (SkillUp)",
    date: "Sep 2022",
  },
  {
    title: "JavaScript for Beginners",
    issuer: "Simplilearn (SkillUp)",
    date: "Sep 2022",
  },
];

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-12">
      <Helmet>
        <title>
          About Mohamed Sharfiras | Enterprise Web & Frontend Developer
        </title>
        <meta
          name="description"
          content="Learn about Mohamed Sharfiras, a Web Developer with 4+ years of experience across enterprise intranets (HSBC), high-traffic eCommerce (Oscar Wylee), legal tech (Versus Law), React, Next.js, and technical SEO."
        />
      </Helmet>

      {/* Intro Narrative Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              Professional Biography
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              About Me
            </h1>
          </div>

          <a
            href="/resume.pdf"
            download="Mohamed_Sharfiras_CV.pdf"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Updated CV</span>
          </a>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
          <p>
            I am a{" "}
            <strong className="text-gray-900 dark:text-white font-semibold">
              Web Developer with 4+ years of professional experience
            </strong>{" "}
            engineering SEO-optimized, high-performance web applications across
            e-commerce, legal tech, and enterprise environments.
          </p>

          <p>
            Currently, I contribute to the global intranet migration at{" "}
            <strong className="text-gray-900 dark:text-white font-semibold">
              HSBC’s Global Service Centre (GSC)
            </strong>
            , managing page production, content integrity, cross-environment
            testing, and production deployment across WordPress and SharePoint.
            My day-to-day focuses on delivering high-fidelity migration under
            multi-stage governance (Dev, UAT, Pre-Pilot, and Production).
          </p>

          <p>
            Throughout my career, I have consistently connected engineering with
            measurable business impact. During my tenure as a Frontend Developer
            for{" "}
            <strong className="text-gray-900 dark:text-white font-semibold">
              Oscar Wylee
            </strong>{" "}
            (via Cloud Atlantic International Group), I drove a{" "}
            <strong className="text-blue-600 dark:text-blue-400 font-semibold">
              +30% increase in organic search traffic
            </strong>
            , lifted mobile performance scores by{" "}
            <strong className="text-blue-600 dark:text-blue-400 font-semibold">
              25%
            </strong>
            , and reduced page load times by{" "}
            <strong className="text-blue-600 dark:text-blue-400 font-semibold">
              15%
            </strong>{" "}
            through rigorous code refactoring, caching, and Core Web Vitals
            alignment.
          </p>

          <p>
            At{" "}
            <strong className="text-gray-900 dark:text-white font-semibold">
              Versus Law
            </strong>
            , I delivered high-converting WordPress and custom JavaScript
            solutions for legal sector clients while architecting AI-powered
            GoHighLevel (GHL) CRM workflows that automated lead pipelines and
            eliminated manual triage bottlenecks.
          </p>

          <p>
            I thrive in collaborative, Agile/Scrum teams working with
            international stakeholders, UX designers, and engineers to deliver
            clean, scalable, and maintainable software.
          </p>
        </div>
      </motion.section>

      {/* What I Bring to the Table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Core Competencies
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.name}
                className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {skill.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {skill.desc}
                </p>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Detailed Technical Skills Inventory */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Technical Toolkit
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {technicalSkills.map((group) => (
            <div
              key={group.category}
              className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Work Experience */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Professional Experience
        </h2>

        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {exp.role}
                  </h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {exp.company}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {exp.location}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-max sm:self-start">
                  {exp.period}
                </span>
              </div>

              <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Certifications & Education */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Education */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span>Education</span>
          </h2>

          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Bachelor of Information and Communication Technology (Honours)
              </h3>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                University of Kelaniya, Sri Lanka
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-2">
                <span>Feb 2018 – Sep 2022</span>
                <span>•</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  GPA: 3.14
                </span>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                G.C.E. Advanced Level
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                T/Kinniya Al-Aqsa College
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                2014 – 2016
              </p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Certifications</span>
          </h2>

          <div className="space-y-3">
            {certifications.map((c, i) => (
              <div
                key={i}
                className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-1"
              >
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {c.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                  <span>{c.issuer}</span>
                  <span>{c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Languages & Location */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 sm:p-7 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
              <LanguagesIcon className="w-5 h-5 text-blue-600" />
              <span>Languages</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="text-gray-800 dark:text-gray-200">
                English:
              </strong>{" "}
              Professional Working Proficiency
              <br />
              <strong className="text-gray-800 dark:text-gray-200">
                Tamil:
              </strong>{" "}
              Native
              <br />
              <strong className="text-gray-800 dark:text-gray-200">
                Sinhala:
              </strong>{" "}
              Conversational
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Location & Availability</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based in{" "}
              <strong className="text-gray-800 dark:text-gray-200">
                Colombo & Mullipothana, Sri Lanka
              </strong>
              .<br />
              Available for high-impact remote engineering roles and select
              consulting engagements worldwide.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
