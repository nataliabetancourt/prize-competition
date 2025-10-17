import React from "react";
import LazyYouTube from "./LazyYoutube.jsx";

export default function VideoSection() {
  return (
    <div className="w-full h-screen bg-[#1a1a21] flex items-center justify-center">
      <div className="w-full max-w-[80%] relative">
        <LazyYouTube videoId="FEOISjC7BYM" />
      </div>
    </div>
  );
}
