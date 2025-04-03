"use client";
import { useState } from "react";

export default function ExecuteSQL() {
  const [query, setQuery] = useState("");
  const [dbType, setDbType] = useState("postgres");
  const [ddl, setDdl] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleExecuteQuery = async () => {
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          dbType,
          ddl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        console.log("Query executed successfully:", data.data);
        setError(null);
      } else {
        setError(data.error);
        setResult(null);
      }
    } catch (err) {
      setError("An error occurred while executing the query.");
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-white">SQL Query Executor</h1>

      <div className="bg-black/40 p-6 rounded-lg shadow-lg mb-6">
        <div className="mb-4">
          <label className="block text-white mb-2 font-medium">SQL Query</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter SQL Query"
            rows={6}
            className="w-full p-3 bg-black/50 border border-red-500/30 rounded-md text-white font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-white mb-2">Database Type</label>
            <select
              value={dbType}
              onChange={(e) => setDbType(e.target.value)}
              className="p-2 bg-black/50 border border-red-500/30 rounded-md text-white"
            >
              <option value="postgres">PostgreSQL (Supabase)</option>
              <option value="mysql">MySQL</option>
              <option value="oracle">Oracle</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="checkbox"
                checked={ddl}
                onChange={() => setDdl(!ddl)}
                className="mr-2 h-5 w-5"
              />
              <span>Is DDL Query?</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleExecuteQuery}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Execute Query
        </button>
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-500 p-4 rounded-lg mb-6">
          <h3 className="text-red-400 font-bold mb-2">Error</h3>
          <div className="text-white">{error}</div>
        </div>
      )}

      {result && (
        <div className="bg-black/40 p-4 rounded-lg">
          <h3 className="text-white font-bold mb-2">Result</h3>

          {/* If result is an array (table data) */}
          {Array.isArray(result) && result.length > 0 ? (
            <div className="overflow-auto">
              <table className="w-full border border-red-500/30 text-white">
                <thead className="bg-black/50">
                  <tr>
                    {Object.keys(result[0]).map((key) => (
                      <th key={key} className="border border-red-500/30 p-2">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border border-red-500/30">
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex} className="p-2">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // If result is just text (DDL query)
            <pre className="bg-black/50 p-4 rounded-md overflow-auto text-white font-mono text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
