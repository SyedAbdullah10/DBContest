// import SqlEditor from "./Components/SqlEditor";

// export default function Home() {
//   return (
//     <div className="p-4 h-screen w-full">
//       <iframe
//         src="https://onecompiler.com/embed/mysql"
//         width="100%"
//         height="600px"
//         sandbox="allow-scripts allow-same-origin allow-forms"
//       ></iframe>

//       {/* <h1 className="text-2xl font-bold mb-4">SQL Code Editor</h1>
//       <SqlEditor /> */}
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const iframeRef = useRef(null);
  const compilerURL = "https://onecompiler.com/embed/mysql";
  const [lastURL, setLastURL] = useState(compilerURL);

  useEffect(() => {
    // Block keyboard shortcuts
    const blockShortcuts = (event) => {
      if (
        (event.altKey &&
          (event.key === "ArrowLeft" || event.key === "ArrowRight")) || // Alt + Left/Right
        (event.ctrlKey && event.key.toLowerCase() === "l") // Ctrl + L
      ) {
        event.preventDefault();
      }
    };

    // Prevent right-click inside the iframe
    const disableRightClick = (event) => {
      if (event.target.tagName === "IFRAME") {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", blockShortcuts);
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("keydown", blockShortcuts);
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  // Check if user navigates away from the compiler
  useEffect(() => {
    const checkIframeURL = () => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        try {
          const currentURL = iframe.contentWindow.location.href;
          if (currentURL !== lastURL) {
            setLastURL(compilerURL);
            iframe.src = compilerURL; // Reset only if the user navigates away
          }
        } catch (error) {
          console.warn("Cross-origin access blocked. Cannot check iframe URL.");
        }
      }
    };

    const interval = setInterval(checkIframeURL, 2000); // Check every 2s

    return () => clearInterval(interval);
  }, [lastURL]);

  return (
    <div className="p-4 h-screen w-full relative">
      {/* Iframe Overlay to prevent interaction with hidden elements */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ pointerEvents: "none", background: "transparent" }}
      ></div>

      {/* SQL Compiler Iframe */}
      <iframe
        ref={iframeRef}
        src={compilerURL}
        width="100%"
        height="600px"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </div>
  );
}
