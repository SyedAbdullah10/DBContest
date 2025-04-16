"use client";

import { useRef, React } from "react";

const OneCompiler = () => {
  const iframeRef = useRef(null);
  const compilerURL = "https://onecompiler.com/embed/mysql";

  return (
    <div className=" w-full flex justify-center items-center">
      <iframe
        ref={iframeRef}
        src={compilerURL}
        width="100%"
        height="1000px"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </div>
  );
};

export default OneCompiler;
