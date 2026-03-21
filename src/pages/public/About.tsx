import { motion } from "framer-motion";
import { Code2, Database, Layout, Terminal } from "lucide-react";
import { Helmet } from "react-helmet-async";

const About = () => {
  const skills = [
    {
      name: "Frontend Development",
      icon: Layout,
      desc: "React, JavaScript, Tailwind CSS, Framer Motion, responsive UI, accessibility, and performance-focused interfaces.",
    },
    {
      name: "CMS & eCommerce",
      icon: Database,
      desc: "WordPress, Magento 2, Shopify, custom components, landing pages, and scalable content and commerce experiences.",
    },
    {
      name: "SEO & Automation",
      icon: Terminal,
      desc: "Technical SEO, on-page optimization, Core Web Vitals, workflow automation, CRM integrations, and GoHighLevel (GHL).",
    },
    {
      name: "Development Approach",
      icon: Code2,
      desc: "Clean code, Agile collaboration, deployment workflows, cross-browser reliability, and practical solutions with business impact.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <Helmet>
        <title>About Me | Mohamed Sharfiras</title>
        <meta
          name="description"
          content="Learn more about Mohamed Sharfiras, a web developer specializing in React, WordPress, Magento, Shopify, SEO, and GoHighLevel automation."
        />
      </Helmet>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          About Me
        </h1>

        <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
          <p className="leading-relaxed">
            I’m a web developer focused on building modern, high-performing
            digital experiences across frontend, CMS, eCommerce, SEO, and
            automation. My core stack includes React, WordPress, Magento, and
            JavaScript-driven solutions that help businesses improve user
            experience, visibility, and operational efficiency.
          </p>

          <p className="leading-relaxed mt-4">
            I started with curiosity about how websites work, and that curiosity
            turned into a career building responsive, accessible, and
            performance-optimized products. Over the years, I’ve worked on
            content-rich websites, eCommerce platforms, and business workflow
            automation—always with a focus on real-world impact.
          </p>

          <p className="leading-relaxed mt-4">
            Most recently, I’ve been working on WordPress, Shopify, and
            GoHighLevel-based solutions, including AI-driven automations, CRM
            integrations, deployment workflows, and on-page SEO improvements.
            Before that, I worked as a Frontend Developer at Oscar Wylee,
            delivering Magento and WordPress experiences with strong SEO
            foundations and measurable performance gains.
          </p>

          <p className="leading-relaxed mt-4">
            I enjoy collaborating in Agile teams, solving practical product
            challenges, and building systems that are not only visually polished
            but also scalable, reliable, and aligned with business goals.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="space-y-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          What I Do
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.name}
                className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-gray-800/10 transition"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {skill.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{skill.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Work Experience
        </h2>

        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Web Developer
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Verss Law | Rajagiriya, Colombo (Hybrid)
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Oct 2025 – Present
              </p>
            </div>

            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
              <li>
                Developing and automating workflows using GoHighLevel (GHL),
                including AI-driven automations and CRM integrations.
              </li>
              <li>
                Building and customizing WordPress and Shopify websites with
                JavaScript enhancements.
              </li>
              <li>
                Managing development, testing, and deployment workflows for
                production-ready releases.
              </li>
              <li>
                Optimizing website performance and implementing on-page SEO best
                practices.
              </li>
              <li>
                Ensuring cross-browser compatibility, responsiveness, and
                reliability across devices.
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Frontend Developer
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Cloud Atlantic International Group (Oscar Wylee) | Sydney
                  (Remote)
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Sep 2022 – Sep 2025
              </p>
            </div>

            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
              <li>
                Developed and maintained eCommerce web pages using Magento 2 and
                WordPress, improving content delivery and customer experience.
              </li>
              <li>
                Increased organic traffic by around 30% through SEO optimization
                and frontend improvements aligned with best practices.
              </li>
              <li>
                Improved website speed by approximately 15% through code
                refactoring, lazy loading, and image compression.
              </li>
              <li>
                Implemented mobile-first responsive design, boosting mobile
                performance by 25% and improving cross-browser compatibility.
              </li>
              <li>
                Collaborated in Agile/Scrum sprints with designers, product
                managers, and backend developers to deliver high-quality
                features.
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Software Engineer Intern
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  KINIT Pvt Ltd | Kinniya
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Dec 2021 – Jun 2022
              </p>
            </div>

            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
              <li>
                Contributed to frontend development of web applications using
                HTML5, CSS3, and JavaScript.
              </li>
              <li>
                Developed reusable React.js components, reducing feature
                delivery time and improving maintainability.
              </li>
              <li>
                Supported performance optimization, reducing load times and
                enhancing overall user experience.
              </li>
              <li>
                Partnered with designers to implement SEO-friendly and
                responsive UI elements, improving search visibility and
                accessibility.
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Education
        </h2>

        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Bachelor of Information and Communication Technology (Honours)
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              University of Kelaniya
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              2018 – 2022 · GPA 3.14
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              G.C.E. Advanced Level
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              T/Kinniya Al-Aqsa College
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              2014 – 2016
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
