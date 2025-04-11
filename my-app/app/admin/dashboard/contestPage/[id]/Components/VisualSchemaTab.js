"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Diagram = () => {
  return (
    <>
      <div className="flex flex-wrap gap-6 justify-center">
        {schema.map((table) => (
          <div
            key={table.table}
            className="border border-red-500/30 rounded-lg p-4 w-64 bg-red-900/10"
          >
            <h4 className="text-lg font-bold mb-2 text-red-300 border-b border-red-500/30 pb-2">
              {table.table}
            </h4>
            <ul className="space-y-1">
              {table.columns.map((column) => (
                <li
                  key={column}
                  className="text-sm flex items-center text-gray-200"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {column}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-red-500/30 pt-4">
        <h4 className="text-lg font-bold mb-2 text-center text-red-300">
          Relationships
        </h4>
        <div className="flex justify-center">
          <svg width="600" height="200" className="opacity-80">
            <line
              x1="100"
              y1="50"
              x2="300"
              y2="50"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <line
              x1="300"
              y1="50"
              x2="300"
              y2="150"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <line
              x1="300"
              y1="150"
              x2="500"
              y2="150"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <line
              x1="500"
              y1="50"
              x2="500"
              y2="150"
              stroke="#ef4444"
              strokeWidth="2"
            />

            <circle
              cx="100"
              cy="50"
              r="30"
              fill="#450a0a"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <circle
              cx="300"
              cy="50"
              r="30"
              fill="#450a0a"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <circle
              cx="300"
              cy="150"
              r="30"
              fill="#450a0a"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <circle
              cx="500"
              cy="50"
              r="30"
              fill="#450a0a"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <circle
              cx="500"
              cy="150"
              r="30"
              fill="#450a0a"
              stroke="#ef4444"
              strokeWidth="2"
            />

            <text x="100" y="55" textAnchor="middle" fill="white" fontSize="12">
              users
            </text>
            <text x="300" y="55" textAnchor="middle" fill="white" fontSize="12">
              orders
            </text>
            <text
              x="300"
              y="155"
              textAnchor="middle"
              fill="white"
              fontSize="12"
            >
              order_items
            </text>
            <text x="500" y="55" textAnchor="middle" fill="white" fontSize="12">
              products
            </text>

            <text
              x="200"
              y="40"
              textAnchor="middle"
              fill="#fca5a5"
              fontSize="10"
            >
              user_id
            </text>
            <text
              x="290"
              y="100"
              textAnchor="middle"
              fill="#fca5a5"
              fontSize="10"
            >
              order_id
            </text>
            <text
              x="400"
              y="140"
              textAnchor="middle"
              fill="#fca5a5"
              fontSize="10"
            >
              product_id
            </text>
            <text
              x="490"
              y="100"
              textAnchor="middle"
              fill="#fca5a5"
              fontSize="10"
            >
              product_id
            </text>
          </svg>
        </div>
      </div>
    </>
  );
};

const VisualSchemaTab = ({ schema }) => {
  return (
    <TabsContent value="schema">
      <Card className="bg-black/40 border border-red-500/30">
        <CardContent className="p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 text-center text-white">
            Database Schema Visualization
          </h3>
          <div className="p-3 m-4 bg-red-900/10 rounded-lg border border-red-500/20 overflow-x-auto text-gray-200 w-full flex flex-col text-center font-bold">
            Coming Soon. . . 
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default VisualSchemaTab;
