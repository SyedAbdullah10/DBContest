"use client";

import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { oracleSQLSupport } from "./utils/oracleSQLmode";
import { dracula } from "@uiw/codemirror-theme-dracula"; // Ensure this is installed

const SqlEditor = () => {

    // we just have to execute this query on the database that has been created for this contest!!

  const [sqlMode, setSqlMode] = useState("mysql");
  const [query, setQuery] = useState("");

  const sqlModes = {
    mysql: sql({}),
    postgresql: sql({}),
    oracle: oracleSQLSupport(),
  };

  return (
    <div>
      {/* Dropdown to Select SQL Dialect */}
      <select
        onChange={(e) => setSqlMode(e.target.value)}
        value={sqlMode}
        className="p-2 mb-2 border rounded"
      >
        <option value="mysql">MySQL</option>
        <option value="postgresql">PostgreSQL</option>
        <option value="oracle">Oracle SQL</option>
      </select>

      {/* CodeMirror SQL Editor */}
      <CodeMirror
        value={query}
        height="300px"
        width="50vw"
        theme={dracula}
        extensions={[sqlModes[sqlMode]]}
        onChange={(val) => setQuery(val)}
      />
    </div>
  );
};

export default SqlEditor;
