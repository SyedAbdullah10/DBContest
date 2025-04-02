"use client";

import React, { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, Edit } from "lucide-react";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";
import "highlight.js/styles/monokai-sublime.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";

hljs.registerLanguage("sql", sql);

const DDLTab = () => {
  const [ddl, setDdl] = useState({
    code: `CREATE TABLE users (
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
);`,
    type: "postgresql",
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedDdl, setEditedDdl] = useState("");
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [sqlMode, setSqlMode] = useState("postgresql");

  useEffect(() => {
    if (sqlMode != ddl.type) {
      const convertDDL = async () => {
        try {
          // const response = await axios.post("/api/convert-ddl", {
          //   ddl: ddl.code,
          //   sourceDb: ddl.type,
          //   targetDb: sqlMode,
          // });
          const response = await axios.post("https://api.sqlify.io/convert", {
            ddl,
            from: ddl.type,
            to: sqlMode,
          });
          setDdl({
            // code: response.data.convertedDDL,
            code: response.data,
            type: sqlMode,
          });
        } catch (err) {
          console.log("Error occured: ", err);
        }
      };

      convertDDL();
    }
  }, [sqlMode]);

  // Generate highlighted HTML whenever ddl changes
  useEffect(() => {
    console.log(ddl);
    const highlighted = hljs.highlight(ddl.code, { language: "sql" }).value;
    setHighlightedCode(highlighted);
  }, [ddl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(ddl.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleEditClick = () => {
    setEditedDdl(ddl.code);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setDdl(editedDdl);
    setIsEditDialogOpen(false);
  };

  return (
    <TabsContent value="ddl">
      <Card className="bg-black/40 border border-red-500/30 relative w-full">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="flex justify-center items-center w-full">
            <h3 className="text-xl font-bold text-white">
              Database Schema Creation
            </h3>
          </div>
          <pre className="p-3 m-4 bg-red-900/10 rounded-lg border border-red-500/20 overflow-x-auto text-gray-200 w-full flex flex-col gap-3">
            <div className="w-full flex gap-4 justify-end">
              <Select onValueChange={setSqlMode} value={sqlMode}>
                <SelectTrigger className="w-56 mb-3 bg-black/40 backdrop-blur-lg text-white border focus:border-red-500/50 border-red-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/40 backdrop-blur-lg text-white border border-red-500/20">
                  <SelectItem value="oracle">Oracle SQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className="hover:border-red-500/50 bg-transparent hover:text-white text-white hover:bg-red-900/30"
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="hover:border-red-500/50 bg-white text-black hover:bg-red-900/30 hover:text-white transition w-max"
              >
                <ClipboardCopy className="w-4 h-4 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="overflow-x-auto w-full">
              <code
                className="language-sql"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </div>
          </pre>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border border-red-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-300 w-full text-center">
              Edit Database Schema
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="ddl-editor"
                className="text-sm font-medium text-gray-300"
              >
                SQL DDL Statements
              </label>
              <Textarea
                id="ddl-editor"
                value={editedDdl}
                onChange={(e) => setEditedDdl(e.target.value)}
                rows={15}
                className="bg-black/60 border-red-500/30 text-white font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="hover:border-red-500/50 bg-transparent text-white hover:text-white hover:bg-red-900/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
};

export default DDLTab;
