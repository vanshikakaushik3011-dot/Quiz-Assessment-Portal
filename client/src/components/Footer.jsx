import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold">Quiz & Assessment Portal</span>
            </div>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
              A comprehensive academic testing and assessment engine built for students and educators. 
              Delivering instant evaluations, insightful analytics, and robust role-based assessment management.
            </p>
            <div className="flex items-center space-x-2 text-xs text-indigo-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>JWT Authentication & Role-Based Access Control</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/student/quizzes" className="hover:text-indigo-400 transition-colors">Explore Quizzes</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">Student Login</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">Teacher Portal</Link>
              </li>
            </ul>
          </div>

          {/* Platform Tech Stack */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-slate-800 rounded-md text-xs text-slate-300 border border-slate-700">React + Vite</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-md text-xs text-slate-300 border border-slate-700">Node.js</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-md text-xs text-slate-300 border border-slate-700">Express</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-md text-xs text-slate-300 border border-slate-700">MongoDB</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-md text-xs text-slate-300 border border-slate-700">Tailwind CSS</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-md text-xs text-slate-300 border border-slate-700">JWT Auth</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Quiz & Assessment Portal. Full-Stack Academic Project.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Engineered with modern full-stack web standards</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
