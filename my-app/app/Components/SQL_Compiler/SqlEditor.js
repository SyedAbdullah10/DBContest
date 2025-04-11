// "use client";
// import React, { useState } from "react";
// import CodeMirror from "@uiw/react-codemirror";
// import { sql } from "@codemirror/lang-sql";
// import { oracleSQLSupport } from "./utils/oracleSQLmode";
// import { dracula } from "@uiw/codemirror-theme-dracula"; // Ensure this is installed
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const SqlEditor = ({ query, setQuery, setSqlMode, sqlMode = "mysql" }) => {
//   // we just have to execute this query on the database that has been created for this contest!!

//   const sqlModes = {
//     mysql: sql({}),
//     postgresql: sql({}),
//     oracle: oracleSQLSupport(),
//   };

//   return (
//     <div>
//       <Select onValueChange={setSqlMode}>
//         <SelectTrigger className="w-56 mb-3 bg-black/40 backdrop-blur-lg text-white border focus:border-red-500/50 border-red-500/20">
//           <SelectValue placeholder="Select Database" />
//         </SelectTrigger>
//         <SelectContent className="bg-black/40 backdrop-blur-lg text-white border border-red-500/20">
//           <SelectItem value="oracle">Oracle SQL</SelectItem>
//           <SelectItem value="mysql">MySQL</SelectItem>
//           <SelectItem value="postgresql">PostgreSQL</SelectItem>
//         </SelectContent>
//       </Select>

//       {/* CodeMirror SQL Editor */}
//       <CodeMirror
//         value={query}
//         height="300px"
//         width="50vw"
//         theme={dracula}
//         extensions={[sqlModes[sqlMode]]}
//         onChange={(val) => setQuery(val)}
//       />
//     </div>
//   );
// };

// export default SqlEditor;

"use client";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { oracleSQLSupport } from "../Dumped/utils/oracleSQLmode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

const SqlEditor = ({
  query,
  setQuery,
  setSqlMode,
  sqlMode = "mysql",
  showOptions = true,
}) => {
  // Custom reddish theme
  const redTheme = createTheme({
    theme: "dark",
    settings: {
      background: "rgb(24, 8, 8)", // Deep dark red background
      foreground: "#e0e0e0", // Light gray text
      caret: "#ff4444", // Bright red cursor
      selection: "rgba(255, 68, 68, 0.3)", // Translucent red selection
      selectionMatch: "rgba(255, 68, 68, 0.2)", // Selection match
      lineHighlight: "rgba(255, 68, 68, 0.1)", // Subtle red line highlight
      gutterBackground: "rgb(32, 12, 12)", // Darker background for gutter
      gutterForeground: "#ff4444", // Red gutter text
    },
    styles: [
      { tag: t.comment, color: "#8b0000" }, // Dark red for comments
      { tag: t.keyword, color: "#ff4444", fontWeight: "bold" }, // Bright red for keywords
      { tag: t.string, color: "#ff6b6b" }, // Lighter red for strings
      { tag: t.propertyName, color: "#ff9999" }, // Soft red for property names
      { tag: t.number, color: "#ff7f7f" }, // Reddish for numbers
    ],
  });

  const sqlModes = {
    mysql: sql({}),
    postgresql: sql({}),
    oracle: oracleSQLSupport(),
  };

  return (
    <div className="">
      {showOptions && (
        <Select onValueChange={setSqlMode}>
          <SelectTrigger className="w-56 mb-3 bg-black/40 backdrop-blur-lg text-white border focus:border-red-500/50 border-red-500/20">
            <SelectValue placeholder="Select Database" />
          </SelectTrigger>
          <SelectContent className="bg-black/40 backdrop-blur-lg text-white border border-red-500/20">
            <SelectItem value="oracle">Oracle SQL</SelectItem>
            <SelectItem value="mysql">MySQL</SelectItem>
            <SelectItem value="postgresql">PostgreSQL</SelectItem>
          </SelectContent>
        </Select>
      )}
      <CodeMirror
        value={query}
        height="300px"
        width="50vw"
        theme={redTheme}
        extensions={[sqlModes[sqlMode]]}
        onChange={(val) => setQuery(val)}
        className="w-full rounded-xl"
      />
    </div>
  );
};

export default SqlEditor;
