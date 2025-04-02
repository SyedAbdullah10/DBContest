"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";

const DDLTab = ({ ddl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ddl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset after 1.5 sec
    });
  };

  return (
    <TabsContent value="ddl">
      <Card className="bg-black/40 border border-red-500/30 relative">
        <CardContent className="p-6">
          <div className="flex justify-center items-center mb-4">
            <h3 className="text-xl font-bold text-white">
              Database Schema Creation
            </h3>
          </div>
          {/*  */}
          <div className="bg-red-900/10 rounded-lg border border-red-500/20 overflow-x-auto text-gray-200 flex flex-col gap-2 w-full">
            <div className="w-full py-2 px-2 flex justify-end">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className={
                  "hover:border-red-500/50 text-black font-bold hover:text-white hover:bg-red-900/20 transition w-max"
                }
              >
                <ClipboardCopy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>

            <pre className="py-2 px-4 w-full overflow-x-auto">{ddl}</pre>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default DDLTab;
