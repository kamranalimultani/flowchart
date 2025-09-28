// src/pages/ComingSoon.tsx
import { motion } from "framer-motion";
import { Mail, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-10">
        {/* Logo / Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🚀 FlowSurvey
        </motion.h1>

        {/* Intro text */}
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          A new way to create **interactive diagrams** with built-in surveys.
          Collaborate visually, collect insights seamlessly. Our beta is coming
          soon!
        </motion.p>

        {/* Notify form */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-auto flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button size="lg">Notify Me</Button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-6 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Github className="w-6 h-6 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <Twitter className="w-6 h-6 text-gray-500 hover:text-blue-500 transition-colors" />
          </a>
          <a href="mailto:contact@flowsurvey.com">
            <Mail className="w-6 h-6 text-gray-500 hover:text-red-500 transition-colors" />
          </a>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-sm text-gray-400 dark:text-gray-500 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          © {new Date().getFullYear()} FlowSurvey · All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}
