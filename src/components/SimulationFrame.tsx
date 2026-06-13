"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface SimulationFrameProps {
  html: string;
  title?: string;
  height?: string;
}

export default function SimulationFrame({ html, title, height = "700px" }: SimulationFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
      setIsLoaded(false);
    }
  }, [html]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const reloadSim = useCallback(() => {
    if (iframeRef.current) {
      setIsLoaded(false);
      iframeRef.current.srcdoc = "";
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.srcdoc = html;
      }, 50);
    }
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={`rounded-xl overflow-hidden border border-surface-200 bg-[#0f172a] relative group ${
        isFullscreen ? "fixed inset-0 z-[9999] rounded-none border-none" : ""
      }`}
    >
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-[#334155] flex items-center justify-between bg-[#1e293b]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-sm text-[#94a3b8] font-medium">
            {title || "Interactive Simulation"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reloadSim}
            className="p-1.5 rounded-md hover:bg-[#334155] text-[#94a3b8] hover:text-white transition-colors"
            title="Reload simulation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md hover:bg-[#334155] text-[#94a3b8] hover:text-white transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 top-[49px] flex items-center justify-center bg-[#0f172a] z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#94a3b8]">Loading simulation...</span>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        srcDoc={html}
        sandbox="allow-scripts allow-same-origin"
        onLoad={handleLoad}
        style={{
          border: "none",
          width: "100%",
          height: isFullscreen ? "calc(100vh - 49px)" : height,
          display: "block",
        }}
        title={title || "Interactive Simulation"}
      />

      {/* Interaction hint */}
      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-xs text-[#64748b] bg-[#1e293b]/90 px-2 py-1 rounded-md backdrop-blur-sm">
          💡 Interact with sliders and buttons to explore
        </span>
      </div>
    </div>
  );
}
