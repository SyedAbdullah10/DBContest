"use client";
import { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  Database,
  ChevronRight,
  Terminal,
  Layers,
} from "lucide-react";
import Logo from "@/app/Components/Logo";
import { motion } from "framer-motion";

export default function AddContest() {
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);
  const [tab, setTab] = useState("ddl");
  const [contestData, setContestData] = useState({
    startTime: "",
    endTime: "",
    ddl: "",
    tables: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [animateIn, setAnimateIn] = useState(false);
  const [pendingRemovals, setPendingRemovals] = useState({});
  // Add this to track if an add operation is in progress
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(null);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const addTable = () => {
    // Prevent multiple additions while animation is in progress
    if (isAddingTable) return;

    setIsAddingTable(true);

    setContestData((prev) => ({
      ...prev,
      tables: [
        ...prev.tables,
        {
          name: "",
          columns: [{ name: "", type: "VARCHAR(255)", id: Date.now() }],
          isNew: true,
          id: Date.now(),
        },
      ],
    }));

    // Remove the isNew flag after animation completes
    setTimeout(() => {
      setContestData((prev) => {
        const newTables = [...prev.tables];
        if (newTables.length > 0) {
          const lastIndex = newTables.length - 1;
          newTables[lastIndex] = { ...newTables[lastIndex], isNew: false };
        }
        return { ...prev, tables: newTables };
      });

      // Reset the adding flag
      setIsAddingTable(false);
    }, 500);
  };

  const addColumn = (tableIndex) => {
    // Prevent multiple additions while animation is in progress
    if (isAddingColumn === tableIndex) return;

    setIsAddingColumn(tableIndex);

    setContestData((prev) => {
      const newTables = [...prev.tables];
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        columns: [
          ...newTables[tableIndex].columns,
          { name: "", type: "VARCHAR(255)", isNew: true, id: Date.now() },
        ],
      };
      return { ...prev, tables: newTables };
    });

    // Remove the isNew flag after animation completes
    setTimeout(() => {
      setContestData((prev) => {
        const newTables = [...prev.tables];
        const lastColIndex = newTables[tableIndex].columns.length - 1;
        newTables[tableIndex].columns[lastColIndex] = {
          ...newTables[tableIndex].columns[lastColIndex],
          isNew: false,
        };
        return { ...prev, tables: newTables };
      });

      // Reset the adding flag
      setIsAddingColumn(null);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare data for submission - remove any internal properties like id, isNew, etc.
    const submissionData = {
      ...contestData,
      tables: contestData?.tables.map((table) => ({
        name: table.name,
        columns: table.columns.map((col) => ({
          name: col.name,
          type: col.type,
        })),
      })),
    };

    console.log(submissionData);

    // try {
    //   const response = await fetch("/api/admin/add-contest", {
    //     method: "POST",
    //     body: JSON.stringify(submissionData),
    //     headers: { "Content-Type": "application/json" },
    //   });

    //   if (response.ok) {
    //     setNotification({
    //       show: true,
    //       message: "Contest added successfully!",
    //       type: "success",
    //     });

    //     // Reset form after successful submission
    //     setContestData({
    //       startTime: "",
    //       endTime: "",
    //       ddl: "",
    //       tables: [],
    //     });
    //   } else {
    //     setNotification({
    //       show: true,
    //       message: "Failed to add contest. Please try again.",
    //       type: "error",
    //     });
    //   }
    // } catch (error) {
    //   setNotification({
    //     show: true,
    //     message: "An error occurred. Please try again.",
    //     type: "error",
    //   });
    // } finally {
    //   setIsLoading(false);

    //   // Hide notification after 3 seconds
    //   setTimeout(() => {
    //     setNotification((prev) => ({ ...prev, show: false }));
    //   }, 3000);
    // }
  };

  const removeTable = (index) => {
    // Mark table for removal animation
    setContestData((prev) => {
      const newTables = [...prev.tables];
      newTables[index] = { ...newTables[index], isRemoving: true };
      return { ...prev, tables: newTables };
    });

    // Actually remove after animation completes
    setTimeout(() => {
      setContestData((prev) => {
        const newTables = prev.tables.filter((_, i) => i !== index);
        return { ...prev, tables: newTables };
      });
    }, 300);
  };

  const removeColumn = (tableIndex, columnId) => {
    // First mark column for removal animation with its unique ID
    setContestData((prev) => {
      const newTables = [...prev.tables];
      const newColumns = [...newTables[tableIndex].columns];

      // Find the column by ID and mark it for removal
      const columnToRemove = newColumns.find((col) => col.id === columnId);
      if (columnToRemove) {
        columnToRemove.isRemoving = true;
      }

      newTables[tableIndex] = { ...newTables[tableIndex], columns: newColumns };
      return { ...prev, tables: newTables };
    });

    // Track this removal in the pending removals
    setPendingRemovals((prev) => ({
      ...prev,
      [`${tableIndex}-${columnId}`]: true,
    }));

    // Actually remove after animation completes
    setTimeout(() => {
      setContestData((prev) => {
        const newTables = [...prev.tables];
        // Filter out the column with the specific ID
        newTables[tableIndex].columns = newTables[tableIndex].columns.filter(
          (col) => !col.isRemoving
        );
        return { ...prev, tables: newTables };
      });

      // Clean up the pending removal
      setPendingRemovals((prev) => {
        const newRemovals = { ...prev };
        delete newRemovals[`${tableIndex}-${columnId}`];
        return newRemovals;
      });
    }, 300);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center py-10 transition-opacity duration-500 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl px-4"
      >
        <div className="flex items-center mb-8 transform translate-y-0 transition-transform duration-500">
          {/* <Database className="text-red-800 mr-3 h-8 w-8" /> */}
          <Logo />
          <h1 className="text-4xl font-bold text-white">Create Contest</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-black/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-red-500/20"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-white font-medium">Start Time</label>
              <div className="relative flex items-center">
                <input
                  type="datetime-local"
                  ref={startDateInputRef}
                  className="w-full p-3 pr-12 bg-black/40 backdrop-blur-lg shadow-xl border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all duration-200"
                  value={contestData?.startTime}
                  onChange={(e) =>
                    setContestData({
                      ...contestData,
                      startTime: e.target.value,
                    })
                  }
                  required
                />
                {/* Clickable Custom Calendar Icon */}
                <button
                  type="button"
                  className="absolute right-4 text-red-500"
                  onClick={() => startDateInputRef.current.showPicker()} // Trigger native date picker
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-white font-medium">End Time</label>
              <div className="relative flex items-center">
                <input
                  type="datetime-local"
                  ref={endDateInputRef}
                  className="w-full p-3 pr-12 bg-black/40 backdrop-blur-lg shadow-xl border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all duration-200"
                  value={contestData?.endTime}
                  onChange={(e) =>
                    setContestData({
                      ...contestData,
                      endTime: e.target.value,
                    })
                  }
                  required
                />
                {/* Clickable Custom Calendar Icon */}
                <button
                  type="button"
                  className="absolute right-4 text-red-500"
                  onClick={() => endDateInputRef.current.showPicker()} // Trigger native date picker
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex mb-6 rounded-md overflow-hidden">
            <button
              type="button"
              className={`p-3 flex-1 flex items-center justify-center ${
                tab === "ddl"
                  ? "bg-red-900 hover:bg-red-800 text-white"
                  : "bg-black/40 backdrop-blur-lg text-white shadow-xl border rounded-l-md border-gray-600"
              } transition-colors duration-200`}
              onClick={() => setTab("ddl")}
            >
              <Terminal className="mr-2 h-4 w-4" />
              <span>SQL Editor</span>
            </button>
            <button
              type="button"
              className={`p-3 flex-1 flex items-center justify-center ${
                tab === "gui"
                  ? "bg-red-900 hover:bg-red-800 text-white"
                  : "bg-black/40 backdrop-blur-lg text-white shadow-xl border rounded-r-md border-gray-600"
              } transition-colors duration-200`}
              onClick={() => setTab("gui")}
            >
              <Layers className="mr-2 h-4 w-4" />
              <span>Visual Builder</span>
            </button>
          </div>

          {/* DDL Input */}
          {tab === "ddl" && (
            <div className="mb-6 transition-all duration-300 transform scale-100 opacity-100">
              <label className="block text-white font-medium mb-2">
                SQL Statements
              </label>
              <textarea
                className="w-full p-4 bg-black/40 backdrop-blur-lg rounded-md shadow-xl border border-gray-600 text-white h-64 font-mono focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all duration-200"
                value={contestData?.ddl}
                onChange={(e) =>
                  setContestData({ ...contestData, ddl: e.target.value })
                }
                placeholder="CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2)
);"
              />
            </div>
          )}

          {/* GUI Table Builder */}
          {tab === "gui" && (
            <div className="mb-6 transition-all duration-300 transform scale-100 opacity-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Define Tables</h2>
                <button
                  type="button"
                  className={`px-4 py-2 bg-red-900 hover:bg-red-800 rounded-md text-white transition-colors duration-200 flex items-center ${
                    isAddingTable ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  onClick={addTable}
                  disabled={isAddingTable}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Table
                </button>
              </div>

              <div className="space-y-4">
                {contestData?.tables.map((table, tableIndex) => (
                  <div
                    key={table.id || tableIndex}
                    className={`bg-black/40 backdrop-blur-lg p-5 rounded-md shadow-xl border border-gray-600 transition-all duration-300
                      ${table.isNew ? "animate-slideIn" : ""}
                      ${
                        table.isRemoving
                          ? "animate-slideOut opacity-0 h-0 overflow-hidden"
                          : ""
                      }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex-1 mr-4">
                        <input
                          type="text"
                          placeholder="Table Name"
                          className="w-full p-3 bg-black/40 backdrop-blur-lg shadow-xl border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all duration-200"
                          value={table.name}
                          onChange={(e) => {
                            const newTables = [...contestData?.tables];
                            newTables[tableIndex].name = e.target.value;
                            setContestData({
                              ...contestData,
                              tables: newTables,
                            });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-red-800 transition-colors duration-200"
                        onClick={() => removeTable(tableIndex)}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      {table.columns.map((col, colIndex) => (
                        <div
                          key={col.id || `${tableIndex}-${colIndex}`}
                          className={`flex items-center gap-3 transition-all duration-300
                            ${col.isNew ? "animate-slideIn" : ""}
                            ${
                              col.isRemoving
                                ? "animate-slideOut opacity-0 h-0 overflow-hidden"
                                : ""
                            }`}
                        >
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Column Name"
                              className="w-full p-3 bg-black/40 backdrop-blur-lg shadow-xl border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all duration-200"
                              value={col.name}
                              onChange={(e) => {
                                const newTables = [...contestData?.tables];
                                newTables[tableIndex].columns[colIndex].name =
                                  e.target.value;
                                setContestData({
                                  ...contestData,
                                  tables: newTables,
                                });
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <select
                              className="w-full p-3 bg-black/40 backdrop-blur-lg shadow-xl border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-all duration-200"
                              value={col.type}
                              onChange={(e) => {
                                const newTables = [...contestData?.tables];
                                newTables[tableIndex].columns[colIndex].type =
                                  e.target.value;
                                setContestData({
                                  ...contestData,
                                  tables: newTables,
                                });
                              }}
                            >
                              <option value="VARCHAR(255)">VARCHAR(255)</option>
                              <option value="INT">INT</option>
                              <option value="TEXT">TEXT</option>
                              <option value="BOOLEAN">BOOLEAN</option>
                              <option value="DATE">DATE</option>
                              <option value="DECIMAL(10,2)">
                                DECIMAL(10,2)
                              </option>
                              <option value="TIMESTAMP">TIMESTAMP</option>
                            </select>
                          </div>
                          {table.columns.length > 1 && (
                            <button
                              type="button"
                              className="p-2 text-gray-500 hover:text-red-800 transition-colors duration-200"
                              onClick={() => removeColumn(tableIndex, col.id)}
                              disabled={col.isRemoving}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                ></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-2 bg-red-900 hover:bg-red-800 rounded-md text-white transition-colors duration-200 flex items-center text-sm ${
                        isAddingColumn === tableIndex
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => addColumn(tableIndex)}
                      disabled={isAddingColumn === tableIndex}
                    >
                      <PlusCircle className="h-3 w-3 mr-2" />
                      Add Column
                    </button>
                  </div>
                ))}
              </div>

              {contestData?.tables.length === 0 && (
                <div className="text-center py-12 border-dashed bg-black/40 backdrop-blur-lg p-8 rounded-md shadow-xl border border-gray-600">
                  <p className="text-white mb-4">No tables defined yet</p>
                  <button
                    type="button"
                    className={`px-4 py-2 bg-red-900 hover:bg-red-800 rounded-md text-white transition-colors duration-200 inline-flex items-center ${
                      isAddingTable ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onClick={addTable}
                    disabled={isAddingTable}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Table
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 bg-red-900 hover:bg-red-800 rounded-md text-white font-medium transition-all duration-200 flex items-center justify-center ${
              isLoading ? "opacity-80" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Create Contest
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Notification */}
        <div
          className={`fixed bottom-5 right-5 p-4 rounded-md shadow-lg transition-all duration-300 transform ${
            notification.show
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          } ${notification.type === "success" ? "bg-green-600" : "bg-red-800"}`}
        >
          <p className="text-white">{notification.message}</p>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideOut {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-20px);
            opacity: 0;
          }
        }
        .animate-slideOut {
          animation: slideOut 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
