"use client";

import Link from "next/link";
import { Sparkles, ExternalLink, Globe, MessageCircle } from "lucide-react";

const links = {
  Product: ["Features", "Templates", "ATS Score", "Pricing", "Changelog"],
  Resources: ["Blog", "Resume Tips", "Career Guide", "ATS Guide", "API Docs"],
  Company: ["About", "Careers", "Press Kit", "Contact", "Affiliates"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
};

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ZoraCV</span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 text-slate-500">
              AI-powered resume builder that helps you land interviews at top companies.
            </p>
            <div className="flex gap-3">
              {[MessageCircle, ExternalLink, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-200 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800/60 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <p>© 2025 ZoraCV, Inc. All rights reserved.</p>
          <p>Made with ♥ for job seekers everywhere</p>
        </div>
      </div>
    </footer>
  );
}
