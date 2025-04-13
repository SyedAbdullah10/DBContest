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
import {
  showEditedToast,
  showErrorToast,
} from "@/app/Components/Dumped/utils/toast";
import axios from "axios";

hljs.registerLanguage("sql", sql);

const DDLTab = ({
  ddl = { mysql: "", oracle: "", postgresql: "" },
  setDdl,
  contestId,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedDdl, setEditedDdl] = useState("");
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [sqlMode, setSqlMode] = useState("postgresql");

  // Generate highlighted HTML whenever ddl changes
  useEffect(() => {
    if (!ddl || !ddl[sqlMode]) {
      setHighlightedCode("// No DDL available for selected SQL type.");
      return;
    }

    const highlighted = hljs.highlight(ddl[sqlMode], {
      language: "sql",
    }).value;
    setHighlightedCode(highlighted);
  }, [ddl, sqlMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(ddl.mysql).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleEditClick = () => {
    setEditedDdl(ddl[sqlMode]);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const ddlKey = sqlMode + "_ddl"; // e.g., mysql_ddl

      const res = await axios.put(`/api/contest-info/${contestId}/ddl`, {
        ddlType: ddlKey,
        ddl: editedDdl,
      });

      // Update only the specific DDL key in state
      setDdl((prev) => ({
        ...prev,
        [ddlKey]: editedDdl,
      }));

      setIsEditDialogOpen(false);
      showEditedToast();
    } catch (error) {
      console.error("Error updating DDL:", error);
      showErrorToast();
    }
  };

  // console.log(ddl);

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
