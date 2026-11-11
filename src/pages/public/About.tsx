import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Download,
  Mail,
  GraduationCap,
  Award,
  Globe,
  Languages as LanguagesIcon,
  CheckCircle2,
} from "lucide-react";
import {
  absoluteUrl,
  buildPersonSchema,
  buildBreadcrumbsSchema,
  resolveImageUrl,
} from "../../utils/seo";

const careerHistory = [
  {
    role: "Web Production Officer",
    company: "GSC, HSBC (via TempServe)",
    location: "Havelock City, Colombo, Sri Lanka",
    period: "Aug 2026 – Present",
    summary:
      "Enterprise intranet migration across WordPress and SharePoint, driving releases through Dev, UAT, pre-pilot, pre-deployment, and full production deployment.",
    contributions: [
      "Build and migrate large volumes of institutional pages, taking work sequentially through Dev, UAT, and production release stages under strict governance.",
      "Execute content validation and layout integrity checks, ensuring migrated assets precisely match source documents and release standards.",
      "Diagnose and resolve cross-environment defects identified during intensive UAT and pre-deployment cycles.",
      "Coordinate tasks and defects in Jira with QA testers, content owners, and project leads to maintain release schedules.",
      "Work within a controlled multi-stage release pipeline supporting clean zero-downtime handovers.",
    ],
  },
  {
    role: "Web Developer",
    company: "Versus Law",
    location: "Rajagiriya, Colombo | Manchester, UK (Remote)",
    period: "Oct 2025 – Aug 2026",
    summary:
      "Engineered high-converting WordPress and custom JavaScript web platforms for UK legal sector clients, paired with automated CRM pipelines.",
    contributions: [
      "Built and customized WordPress and bespoke JavaScript client websites, improving user experience and inquiry conversions for legal practices.",
      "Architected CRM automation workflows in GoHighLevel (GHL) with AI-powered triggers, reducing manual lead processing and elevating pipeline velocity.",
      "Implemented on-page and technical SEO strategies (metadata architecture, structured data schema, Core Web Vitals) boosting organic visibility.",
      "Managed CI/CD deployment pipelines to maintain stable, production-ready releases with mobile-first responsiveness.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Oscar Wylee (via Cloud Atlantic International Group)",
    location: "Sydney, AU (Remote)",
    period: "Sep 2022 – Sep 2025",
    summary:
      "Engineered and maintained high-traffic omnichannel eCommerce web pages using Magento 2 and WordPress for a leading Australian retail brand.",
    contributions: [
      "Drove a 30% increase in organic traffic through targeted technical SEO, keyword alignment, and Core Web Vitals compliance.",
      "Reduced average page load times by 15% via frontend code refactoring, intelligent lazy loading, image compression pipelines, and caching policies.",
      "Improved mobile performance scores by 25% by standardizing mobile-first responsive architecture and conducting rigorous cross-browser testing.",
      "Collaborated in Agile/Scrum sprints with international UX designers, product owners, and backend engineers.",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "KINIT",
    location: "Kinniya, Sri Lanka",
    period: "Dec 2021 – Jun 2022",
    summary:
      "Built accessible, standards-compliant web components using HTML5, CSS3, and JavaScript, contributing to reusable frontend libraries.",
    contributions: [
      "Developed reusable React.js components, reducing repeated development effort and improving team codebase maintainability.",
      "Participated in performance audits and code refactoring to optimize application load times.",
    ],
  },
];

const experienceMatrix = [
  {
    organization: "GSC, HSBC (via TempServe)",
    role: "Web Production Officer",
    period: "Aug 2026 – Present",
    domain: "Global Enterprise Banking Intranet",
    stack: ["WordPress", "SharePoint", "HTML5", "CSS3", "JavaScript", "JIRA"],
    governance: "Dev → UAT → Pilot → Production Release Gateways",
    deliverables:
      "Enterprise page migrations, defect resolution, brand consistency, and WCAG AA compliance.",
  },
  {
    organization: "Oscar Wylee (via Cloud Atlantic)",
    role: "Frontend Developer",
    period: "Sep 2024 – Jul 2026",
    domain: "High-Traffic Retail eCommerce (AU/NZ/CA)",
    stack: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Technical SEO",
      "Core Web Vitals",
    ],
    governance: "A/B Testing, Lighthouse CI, Schema Architecture",
    deliverables:
      "+30% organic search boost, +25% mobile speed uplift, -15% load latency.",
  },
  {
    organization: "Versus Law",
    role: "Web Developer & CRM Integrator",
    period: "Oct 2023 – Aug 2024",
    domain: "UK Legal Practice & Claims Platforms",
    stack: ["WordPress", "PHP", "Custom JS", "GoHighLevel CRM", "Webhooks"],
    governance: "Secure Client Document Intake & CRM Automation",
    deliverables:
      "High-converting legal intake portals with automated lead sync pipelines.",
  },
  {
    organization: "KINIT",
    role: "Associate Web Developer",
    period: "Dec 2021 – Jun 2022",
    domain: "Commercial Web Applications",
    stack: ["React", "JavaScript", "REST APIs", "Modern CSS"],
    governance: "Component-driven Agile Sprints",
    deliverables:
      "Reusable React component libraries and cross-browser interface delivery.",
  },
];

const technicalToolkit = [
  {
    group: "Frontend Architecture",
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "HTML5 & Semantic Markup",
      "CSS3 / PostCSS",
      "Framer Motion",
      "Bootstrap",
      "jQuery",
    ],
  },
  {
    group: "Enterprise & CMS",
    skills: [
      "WordPress (Custom themes & architecture)",
      "SharePoint",
      "Magento 2",
      "WooCommerce",
      "Shopify",
      "GoHighLevel (GHL Automation)",
    ],
  },
  {
    group: "Backend & Cloud",
    skills: [
      "Node.js",
      "Express.js",
      "RESTful APIs",
      "JWT Authentication",
      "Firebase (Firestore, Auth, Storage)",
      "Supabase",
      "MongoDB",
      "MySQL",
    ],
  },
  {
    group: "DevOps & Tooling",
    skills: [
      "Git & Version Control",
      "GitHub & Bitbucket",
      "CI/CD Pipelines",
      "Vite",
      "Jira & Agile Workflows",
      "Cloudinary REST API",
    ],
  },
  {
    group: "SEO, Performance & QA",
    skills: [
      "Technical SEO Architecture",
      "On-Page Optimization",
      "Core Web Vitals Compliance",
      "JSON-LD Schema Markup",
      "Google Search Console",
      "Ahrefs",
      "UAT & Regression Testing",
      "Content Integrity Auditing",
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
  const canonicalUrl = absoluteUrl("/about");

  return (
    <div className="space-y-16 max-w-4xl mx-auto">
      <Helmet>
        <title>About Mohamed Sharfiras — Web Developer</title>
        <meta
          name="description"
          content="Professional background of Mohamed Sharfiras: 4+ years of experience across enterprise intranet migrations (HSBC), high-traffic eCommerce (Oscar Wylee), React, Next.js, and Technical SEO."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:title"
          content="About Mohamed Sharfiras — Web Developer"
        />
        <meta
          property="og:description"
          content="4+ years of professional experience across enterprise web migrations, high-performance eCommerce, React, Next.js, and Technical SEO."
        />
        <meta property="og:image" content={resolveImageUrl(null)} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(buildPersonSchema())}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(
            buildBreadcrumbsSchema([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          )}
        </script>
      </Helmet>

      {/* 1. Concise Introduction & Professional Focus */}
      <section className="space-y-6 border-b border-[#E5E4DE] dark:border-[#27313A] pb-12">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            Professional Narrative
          </p>
          <h1 className="fluid-h1 font-extrabold text-[#171F24] dark:text-[#F1F4F6] tracking-tight">
            About Mohamed Sharfiras
          </h1>
          <p className="text-sm sm:text-base text-[#55626F] dark:text-[#97A3AF] font-mono">
            Web Developer &bull; Enterprise Web, Applications &amp; SEO
          </p>
        </div>

        <div className="reading-measure space-y-4 text-base text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
          <p>
            I am a{" "}
            <strong className="text-[#171F24] dark:text-[#F1F4F6] font-semibold">
              Web Developer with 4+ years of professional experience
            </strong>{" "}
            engineering high-performance web applications, large-scale
            enterprise intranets, and scalable eCommerce systems. My work
            focuses on connecting technical precision with measurable business
            outcomes.
          </p>
          <p>
            Currently, I work as a{" "}
            <strong className="text-[#171F24] dark:text-[#F1F4F6] font-semibold">
              Web Production Officer at GSC, HSBC (via TempServe)
            </strong>{" "}
            in Havelock City, Colombo. In this role, I manage page building,
            content migration, defect resolution, and deployment governance for
            a global enterprise intranet across WordPress and SharePoint through
            Dev, UAT, and production release cycles.
          </p>
          <p>
            Previously, as a Frontend Developer at{" "}
            <strong className="text-[#171F24] dark:text-[#F1F4F6] font-semibold">
              Oscar Wylee
            </strong>{" "}
            (via Cloud Atlantic International Group), I drove a{" "}
            <strong className="text-[#171F24] dark:text-[#F1F4F6] font-semibold">
              30% increase in organic search traffic
            </strong>
            , improved mobile performance scores by{" "}
            <strong className="text-[#171F24] dark:text-[#F1F4F6] font-semibold">
              25%
            </strong>
            , and reduced average page load times by{" "}
            <strong className="text-[#171F24] dark:text-[#F1F4F6] font-semibold">
              15%
            </strong>{" "}
            through technical SEO, lazy loading, code refactoring, and Core Web
            Vitals alignment.
          </p>
          <p>
            At{" "}
            <strong className="text-[#171F24] dark:text-[#F1F4F6] font-semibold">
              Versus Law
            </strong>
            , I delivered high-converting WordPress and custom JavaScript
            websites for legal sector clients while architecting automated CRM
            workflows in GoHighLevel (GHL) that reduced lead processing latency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="/resume.pdf"
            download="Mohamed_Sharfiras_CV.pdf"
            className="min-h-[44px] px-5 py-2.5 rounded-md bg-[#171F24] dark:bg-[#F1F4F6] text-[#FFFFFF] dark:text-[#171F24] text-xs sm:text-sm font-semibold hover:bg-[#27313A] dark:hover:bg-[#E5E4DE] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#1F51D0]"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download Updated CV</span>
          </a>

          <Link
            to="/contact"
            className="min-h-[44px] px-5 py-2.5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] text-[#171F24] dark:text-[#F1F4F6] text-xs sm:text-sm font-semibold hover:bg-[#F2F1EC] dark:hover:bg-[#222B33] transition-colors inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#1F51D0]"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>Discuss a Project</span>
          </Link>
        </div>
      </section>

      {/* 2. Chronological Employment History */}
      <section className="space-y-8 border-b border-[#E5E4DE] dark:border-[#27313A] pb-14">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            Work Experience
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
            Career History
          </h2>
        </div>

        <div className="space-y-8">
          {careerHistory.map((item, idx) => (
            <article
              key={idx}
              className="p-6 sm:p-7 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-[#E5E4DE] dark:border-[#27313A] pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#171F24] dark:text-[#F1F4F6]">
                    {item.role}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#1F51D0] dark:text-[#4F7FF7]">
                    {item.company}
                  </p>
                  <p className="text-xs text-[#55626F] dark:text-[#97A3AF] font-mono mt-0.5">
                    {item.location}
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-sm bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF] self-start sm:self-auto">
                  {item.period}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#171F24] dark:text-[#F1F4F6] font-medium leading-relaxed">
                {item.summary}
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF]">
                {item.contributions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Engineering Systems & Impact Matrix */}
      <section className="space-y-6 border-b border-[#E5E4DE] dark:border-[#27313A] pb-14">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            Architecture &amp; Outcomes
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
            Systems &amp; Impact Matrix
          </h2>
          <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] max-w-2xl">
            A cross-functional mapping of career engagements, domain scale,
            governance models, and verified technical outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experienceMatrix.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-lg border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-4 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[#E5E4DE] dark:border-[#27313A] pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#171F24] dark:text-[#F1F4F6]">
                    {item.organization}
                  </h3>
                  <p className="text-xs font-medium text-[#1F51D0] dark:text-[#4F7FF7]">
                    {item.role}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#55626F] dark:text-[#97A3AF] shrink-0">
                  {item.period}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="font-mono uppercase text-[10px] text-[#55626F] dark:text-[#97A3AF] block mb-0.5">
                    Domain &amp; Scale
                  </span>
                  <span className="font-medium text-[#171F24] dark:text-[#F1F4F6]">
                    {item.domain}
                  </span>
                </div>

                <div>
                  <span className="font-mono uppercase text-[10px] text-[#55626F] dark:text-[#97A3AF] block mb-0.5">
                    Governance Model
                  </span>
                  <span className="text-[#55626F] dark:text-[#97A3AF]">
                    {item.governance}
                  </span>
                </div>

                <div>
                  <span className="font-mono uppercase text-[10px] text-[#55626F] dark:text-[#97A3AF] block mb-0.5">
                    Core Technologies
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.stack.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2F1EC] dark:bg-[#222B33] text-[#171F24] dark:text-[#F1F4F6]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E4DE] dark:border-[#27313A]">
                  <span className="font-mono uppercase text-[10px] text-[#55626F] dark:text-[#97A3AF] block mb-0.5">
                    Key Outcomes &amp; Deliverables
                  </span>
                  <p className="text-xs font-medium text-[#171F24] dark:text-[#F1F4F6] leading-relaxed">
                    {item.deliverables}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Compact Technical Toolkit */}
      <section className="space-y-6 border-b border-[#E5E4DE] dark:border-[#27313A] pb-14">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-[#1F51D0] dark:text-[#4F7FF7]">
            Core Stack
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#171F24] dark:text-[#F1F4F6]">
            Technical Toolkit
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {technicalToolkit.map((toolkit) => (
            <div
              key={toolkit.group}
              className="p-5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-3"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#171F24] dark:text-[#F1F4F6] pb-1 border-b border-[#E5E4DE] dark:border-[#27313A]">
                {toolkit.group}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {toolkit.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono px-2 py-0.5 rounded-sm bg-[#F2F1EC] dark:bg-[#222B33] text-[#55626F] dark:text-[#97A3AF]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Education & Certifications */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#E5E4DE] dark:border-[#27313A] pb-14">
        {/* Education */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#171F24] dark:text-[#F1F4F6]">
            <GraduationCap
              className="w-5 h-5 text-[#1F51D0] dark:text-[#4F7FF7]"
              aria-hidden="true"
            />
            <h2 className="text-lg font-bold">Education</h2>
          </div>

          <div className="p-5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-2">
            <h3 className="text-sm font-bold text-[#171F24] dark:text-[#F1F4F6]">
              Bachelor of Information and Communication Technology (Honours)
            </h3>
            <p className="text-xs sm:text-sm text-[#1F51D0] dark:text-[#4F7FF7]">
              University of Kelaniya, Sri Lanka
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-[#55626F] dark:text-[#97A3AF] pt-1">
              <span>Feb 2018 – Sep 2022</span>
              <span>&bull;</span>
              <span>GPA: 3.14</span>
            </div>
          </div>

          <div className="p-5 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-1">
            <h3 className="text-sm font-bold text-[#171F24] dark:text-[#F1F4F6]">
              G.C.E. Advanced Level
            </h3>
            <p className="text-xs text-[#55626F] dark:text-[#97A3AF]">
              T/Kinniya Al-Aqsa College (2014 – 2016)
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#171F24] dark:text-[#F1F4F6]">
            <Award className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <h2 className="text-lg font-bold">Certifications</h2>
          </div>

          <div className="space-y-3">
            {certifications.map((c, i) => (
              <div
                key={i}
                className="p-4 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228] space-y-1"
              >
                <h3 className="text-xs sm:text-sm font-bold text-[#171F24] dark:text-[#F1F4F6]">
                  {c.title}
                </h3>
                <div className="flex justify-between items-center text-xs font-mono text-[#55626F] dark:text-[#97A3AF]">
                  <span>{c.issuer}</span>
                  <span>{c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Languages, Location & Availability */}
      <section className="p-6 sm:p-8 rounded-md border border-[#E5E4DE] dark:border-[#27313A] bg-[#FFFFFF] dark:bg-[#1B2228]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#171F24] dark:text-[#F1F4F6] font-bold text-sm">
              <LanguagesIcon
                className="w-4 h-4 text-[#1F51D0] dark:text-[#4F7FF7]"
                aria-hidden="true"
              />
              <span>Languages</span>
            </div>
            <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              <strong className="text-[#171F24] dark:text-[#F1F4F6]">
                English:
              </strong>{" "}
              Professional Working Proficiency
              <br />
              <strong className="text-[#171F24] dark:text-[#F1F4F6]">
                Tamil:
              </strong>{" "}
              Native
              <br />
              <strong className="text-[#171F24] dark:text-[#F1F4F6]">
                Sinhala:
              </strong>{" "}
              Conversational
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#171F24] dark:text-[#F1F4F6] font-bold text-sm">
              <Globe
                className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <span>Location &amp; Availability</span>
            </div>
            <p className="text-xs sm:text-sm text-[#55626F] dark:text-[#97A3AF] leading-relaxed">
              Based in{" "}
              <strong className="text-[#171F24] dark:text-[#F1F4F6]">
                Colombo &amp; Mullipothana, Sri Lanka
              </strong>
              .<br />
              Available for specialized intranet consulting, client projects,
              and remote collaboration worldwide.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
