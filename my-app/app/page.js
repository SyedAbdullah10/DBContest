"use client";

import { useEffect, useState } from "react";
import OneCompiler from "./Components/OneCompiler";

export default function Home() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Function to check if DevTools is open
    const detectDevTools = () => {
      if (
        window.outerWidth - window.innerWidth > 160 ||
        window.outerHeight - window.innerHeight > 160
      ) {
        setIsDevToolsOpen(true);
      } else {
        setIsDevToolsOpen(false);
      }
    };

    // Block keyboard shortcuts
    const blockShortcuts = (event) => {
      if (
        event.key === "F12" || // DevTools
        (event.ctrlKey &&
          event.shiftKey &&
          ["I", "J", "C"].includes(event.key)) || // Ctrl+Shift+I/J/C
        (event.ctrlKey && ["U", "L"].includes(event.key.toUpperCase())) || // Ctrl+U (View Source), Ctrl+L
        (event.altKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) // Alt + Left/Right
      ) {
        event.preventDefault();
      }
    };

    // Prevent right-click
    const disableRightClick = (event) => event.preventDefault();

    const devToolsCheckInterval = setInterval(detectDevTools, 1000);

    document.addEventListener("keydown", blockShortcuts);
    document.addEventListener("contextmenu", disableRightClick);
    window.addEventListener("resize", detectDevTools); // Recheck when resizing

    return () => {
      document.removeEventListener("keydown", blockShortcuts);
      document.removeEventListener("contextmenu", disableRightClick);
      window.removeEventListener("resize", detectDevTools);
      clearInterval(devToolsCheckInterval);
    };
  }, []);

  return (
    <div className="p-4 h-screen w-full flex justify-center items-center">
      {isDevToolsOpen ? (
        <h1 className="text-red-600 text-2xl font-bold">DevTools detected!!</h1>
      ) : (
        <OneCompiler />
      )}
    </div>
  );
}
