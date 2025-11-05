"use client";

import { Upload, PenTool, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function ChoiceScreen({
  isDark,
  onUpload,
  onCreate,
}: {
  isDark: boolean;
  onUpload: () => void;
  onCreate: () => void;
}) {
  return (
    <div className={`min-h-screen py-16 px-6 ${isDark ? "bg-[#0b0f19] text-white" : "bg-[#f4edff] text-[#2e1065]"}`}>
      <div className="max-w-5xl mx-auto text-center">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-3">
          Build Your <span className={isDark ? "text-teal-300" : "text-purple-600"}>Dream CV</span>
        </h1>

        {/* Subtitle */}
        <p className={`text-base mb-10 ${isDark ? "text-gray-300" : "text-purple-800"}`}>
          Upload your resume or craft a new one with AI-powered guidance.
        </p>

        {/* Divider Line */}
        <div className={`h-1 w-48 mx-auto mb-14 rounded-full ${
          isDark 
            ? "bg-gradient-to-r from-teal-400 to-transparent" 
            : "bg-gradient-to-r from-purple-600 to-transparent"
        }`} />

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* Upload Card */}
          <div className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-purple-200"} border rounded-2xl p-8 shadow-lg`}>
            <div className="flex justify-center mb-4">
              <Upload size={40} className={isDark ? "text-teal-300" : "text-purple-500"} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Upload Existing CV</h2>
            <p className={`mb-6 text-sm ${isDark ? "text-gray-300" : "text-purple-700"}`}>
              Already have a CV? Upload it to get AI-powered feedback and optimization suggestions.
            </p>

            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2"><CheckCircle className="text-green-400" size={16}/> Instant AI analysis</li>
              <li className="flex items-center gap-2"><CheckCircle className="text-green-400" size={16}/> ATS compatibility check</li>
              <li className="flex items-center gap-2"><CheckCircle className="text-green-400" size={16}/> Improvement recommendations</li>
              <li className="flex items-center gap-2"><CheckCircle className="text-green-400" size={16}/> Download optimized version</li>
            </ul>

            <Button 
              onClick={onUpload} 
              className={isDark ? "bg-teal-400 text-[#0b0f19] hover:bg-teal-500 w-full" : "bg-purple-600 hover:bg-purple-700 text-white w-full"}>
              <Upload size={16} className="mr-2" /> Upload My CV
            </Button>
          </div>

          {/* Create Card */}
          <div className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-purple-200"} border rounded-2xl p-8 shadow-lg`}>
            <div className="flex justify-center mb-4">
              <PenTool size={40} className={isDark ? "text-pink-300" : "text-pink-600"} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Create New CV</h2>
            <p className={`mb-6 text-sm ${isDark ? "text-gray-300" : "text-purple-700"}`}>
              Don't have a CV yet? Our guided builder will help you create a professional resume step-by-step.
            </p>

            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2"><Sparkles className="text-yellow-300" size={16}/> Step-by-step guidance</li>
              <li className="flex items-center gap-2"><Sparkles className="text-yellow-300" size={16}/> AI-powered suggestions</li>
              <li className="flex items-center gap-2"><Sparkles className="text-yellow-300" size={16}/> Professional templates</li>
              <li className="flex items-center gap-2"><Sparkles className="text-yellow-300" size={16}/> Export as PDF</li>
            </ul>

            <Button 
              onClick={onCreate} 
              className={isDark ? "bg-pink-400 text-[#0b0f19] hover:bg-pink-500 w-full" : "bg-pink-600 hover:bg-pink-700 text-white w-full"}>
              <PenTool size={16} className="mr-2" /> Create My CV
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
