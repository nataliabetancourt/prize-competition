"use client";
import React, { useState, useRef, useEffect } from "react";

export default function LazyYouTube({
  videoId = "FEOISjC7BYM",
  width = "100%",
  aspectRatio = "56.25%", // 16:9 aspect ratio
  autoplay = 1,
  mute = 1,
  loop = 1,
  controls = 0,
  ...props
}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef(null);

  // Use IntersectionObserver to load the iframe only when the component is in view
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect(); // Stop observing once loaded
      }
    });
    observer.observe(containerRef.current);
    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  // YouTube embed URL with parameters
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=${mute}&loop=${loop}&playlist=${videoId}&controls=${controls}`;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width,
        paddingBottom: aspectRatio, // maintain the aspect ratio
      }}
      {...props}
    >
      {shouldLoad ? (
        <iframe
          title="Car Repair Video"
          src={src}
          frameBorder="0"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "8px",
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        // Facade (placeholder) - could be a thumbnail, a spinner, or just a dark box
        <div
          style={{
            backgroundColor: "#000",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "8px",
          }}
        />
      )}
    </div>
  );
}
