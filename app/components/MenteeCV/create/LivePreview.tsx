"use client";

import React from "react";

type Props = {
  htmlDoc: string;          
  isDark?: boolean;
  sticky?: boolean;        
  stickyTop?: number;      
  className?: string;       
  paperWidth?: number;    
  paperHeight?: number;     
  showHeader?: boolean;     
  title?: string;           
};

export default function LivePreview({
  htmlDoc,
  isDark = false,
  sticky = true,
  stickyTop = 24,
  className = "",
  paperWidth = 820,
  paperHeight = 1160,
  showHeader = true,
  title = "Live HTML Preview",
}: Props) {
  return (
    <div className={`${sticky ? "lg:sticky" : ""}`} style={sticky ? { top: stickyTop } : undefined}>
      <div
        className={[
          "rounded-2xl border shadow-xl overflow-hidden",
          isDark ? "bg-white/5 border-white/10" : "bg-white border-[#e9d5ff]",
          className,
        ].join(" ")}
      >
        {showHeader && (
          <div
            className={[
              "px-4 py-3 border-b text-sm flex items-center justify-between",
              isDark ? "border-white/10 bg-white/5" : "border-[#e9d5ff] bg-purple-50/60",
            ].join(" ")}
          >
            <span className="font-medium">{title}</span>
            <span className={isDark ? "text-[#99a1af]" : "text-[#6b21a8]"}>A4</span>
          </div>
        )}

        <div className="p-4 overflow-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
          <div className="flex justify-center">
            <iframe
              key={htmlDoc.length}               
              title="cv-preview"
              srcDoc={htmlDoc}
              className="bg-white border rounded-xl"
              style={{ width: paperWidth, height: paperHeight }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
