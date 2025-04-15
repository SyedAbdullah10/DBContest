"use client";

import { useEffect, useState } from "react";
import OneCompiler from "./Components/OneCompiler";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

{
  /* <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyMjIiIG9wYWNpdHk9IjAuMiI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div> */
}

export default function Home() {
  // const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  // useEffect(() => {
  //   // Function to check if DevTools is open
  //   const detectDevTools = () => {
  //     if (
  //       window.outerWidth - window.innerWidth > 160 ||
  //       window.outerHeight - window.innerHeight > 160
  //     ) {
  //       setIsDevToolsOpen(true);
  //     } else {
  //       setIsDevToolsOpen(false);
  //     }
  //   };

  //   // Block keyboard shortcuts
  //   const blockShortcuts = (event) => {
  //     if (
  //       event.key === "F12" || // DevTools
  //       (event.ctrlKey &&
  //         event.shiftKey &&
  //         ["I", "J", "C"].includes(event.key)) || // Ctrl+Shift+I/J/C
  //       (event.ctrlKey && ["U", "L"].includes(event.key.toUpperCase())) || // Ctrl+U (View Source), Ctrl+L
  //       (event.altKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) // Alt + Left/Right
  //     ) {
  //       event.preventDefault();
  //     }
  //   };

  //   // Prevent right-click
  //   const disableRightClick = (event) => event.preventDefault();

  //   const devToolsCheckInterval = setInterval(detectDevTools, 1000);

  //   document.addEventListener("keydown", blockShortcuts);
  //   document.addEventListener("contextmenu", disableRightClick);
  //   window.addEventListener("resize", detectDevTools); // Recheck when resizing

  //   return () => {
  //     document.removeEventListener("keydown", blockShortcuts);
  //     document.removeEventListener("contextmenu", disableRightClick);
  //     window.removeEventListener("resize", detectDevTools);
  //     clearInterval(devToolsCheckInterval);
  //   };
  // }, []);

  // const { data: session, data } = useSession();

  // if (!session) {
  //   return redirect("/user");
  // }

  // if (session?.user?.role === "admin") {
  //   return redirect("/admin");
  // }

  // return redirect("/user");

  return <>Hello World</>;
}
