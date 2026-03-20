import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Layout, Terminal } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const About = () => {
  const skills = [
    { name: 'Frontend', icon: Layout, desc: 'React, Tailwind CSS, Framer Motion, TypeScript' },
    { name: 'Backend', icon: Database, desc: 'Node.js, Firebase, PostgreSQL, REST APIs' },
    { name: 'Tools', icon: Terminal, desc: 'Git, Docker, VS Code, Vite, Vercel' },
    { name: 'Core', icon: Code2, desc: 'Problem Solving, Clean Code, Agile Development' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <Helmet>
        <title>About Me | Alex Walker</title>
        <meta name="description" content="Learn more about my skills, background, and tech stack." />
      </Helmet>

      <motion.section 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">About Me</h1>
        <div className="prose prose-lg text-gray-600">
          <p className="leading-relaxed">
            I'm a passionate full-stack developer dedicated to building elegant, efficient, and scalable web applications. 
            With a strong foundation in modern JavaScript ecosystems, I focus on creating seamless user experiences powered by robust backend architectures.
          </p>
          <p className="leading-relaxed mt-4">
            When I'm not coding, you can usually find me exploring new technologies, contributing to open-source projects, or writing technical articles to share my knowledge with the community.
          </p>
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-8"
      >
        <h2 className="text-2xl font-bold text-gray-900">What I Do</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div key={skill.name} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{skill.name}</h3>
                <p className="text-gray-600">{skill.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
};

export default About;
