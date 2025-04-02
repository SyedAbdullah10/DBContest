"use client";

import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Handle,
  Position,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const parseDDL = (ddl) => {
  const tableRegex = /CREATE TABLE (\w+) \(([^;]+)\);/gi;
  const foreignKeyRegex = /FOREIGN KEY \((\w+)\) REFERENCES (\w+)\((\w+)\)/gi;

  let tables = {};
  let edges = [];

  let match;
  while ((match = tableRegex.exec(ddl)) !== null) {
    const [, tableName, columnsStr] = match;
    const columns = columnsStr
      .split(",")
      .map((col) => col.trim().split(" ")[0]);
    tables[tableName] = columns;
  }

  while ((match = foreignKeyRegex.exec(ddl)) !== null) {
    const [, column, refTable, refColumn] = match;
    edges.push({
      source: refTable,
      target: match.input.match(/CREATE TABLE (\w+)/)[1],
      label: `${column} → ${refColumn}`,
    });
  }

  return { tables, edges };
};

const TableNode = ({ data }) => (
  <div className="bg-white shadow-lg rounded-lg border p-4 text-sm">
    <div className="font-bold text-lg mb-2">{data.label}</div>
    <ul className="text-gray-700">
      {data.columns.map((col, idx) => (
        <li key={idx} className="border-t py-1">
          {col}
        </li>
      ))}
    </ul>
    <Handle type="source" position={Position.Right} />
    <Handle type="target" position={Position.Left} />
  </div>
);

const DDLVisualizer = ({ ddl }) => {
  ddl = `CREATE TABLE users (
  user_id INT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  inventory INT NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);`;
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    const { tables, edges } = parseDDL(ddl);

    // Improve node positioning using a grid-like structure
    let positions = {};
    let x = 100,
      y = 100,
      row = 0;
    Object.keys(tables).forEach((table, index) => {
      positions[table] = { x, y };
      x += 250; // Move right
      if ((index + 1) % 3 === 0) {
        x = 100; // Reset to left
        y += 200; // Move down
      }
    });

    setNodes(
      Object.entries(tables).map(([table, columns]) => ({
        id: table,
        type: "tableNode",
        position: positions[table],
        data: { label: table, columns },
        draggable: true,
      }))
    );

    setEdges(
      edges.map((edge) => ({
        ...edge,
        id: `${edge.source}-${edge.target}`,
        animated: true,
      }))
    );
  }, [ddl]);

  return (
    <div className="h-[500px] w-full border rounded-md shadow-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ tableNode: TableNode }}
        fitView
        panOnScroll
        zoomOnScroll
        nodesDraggable
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default DDLVisualizer;
