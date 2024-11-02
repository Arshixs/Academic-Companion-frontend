// src/components/CodeEditor.tsx
import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Share, Play, Square, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Cookies from "js-cookie";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  readOnly?: boolean;
  onSave?: (code: string) => void;
}

interface ExecutionResult {
  output: string;
  error?: string;
  execution_time?: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = "",
  language = "typescript",
  readOnly = false,
  onSave,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  const [isConsoleVisible, setIsConsoleVisible] = useState(false);
  const accessToken = Cookies.get("access_token");

  useEffect(() => {
    if (editorRef.current) {
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: initialCode,
        language,
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        readOnly,
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: true,
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
          vertical: "visible",
          horizontal: "visible",
        },
      });

      return () => {
        if (monacoEditorRef.current) {
          monacoEditorRef.current.dispose();
        }
      };
    }
  }, [initialCode, language, readOnly]);

  const handleExecuteCode = async () => {
    if (!monacoEditorRef.current) return;

    const code = monacoEditorRef.current.getValue();
    setIsExecuting(true);
    setIsConsoleVisible(true);

    try {
      const response = await fetch("http://localhost:8000/code/execute-code/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const result = await response.json();
      setExecutionResult(result);
    } catch (error) {
      setExecutionResult({
        output: "",
        error: "Failed to execute code. Please try again.",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSave = async () => {
    if (!monacoEditorRef.current) return;

    const code = monacoEditorRef.current.getValue();

    try {
      const response = await fetch("http://127.0.0.1:8000/code/code/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          code,
          language,
          title: "Untitled",
          description: "",
        }),
      });

      if (!response.ok) throw new Error("Failed to save code");

      onSave?.(code);
    } catch (error) {
      console.error("Error saving code:", error);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (monacoEditorRef.current) {
      monaco.editor.setModelLanguage(
        monacoEditorRef.current.getModel()!,
        newLanguage
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card className="w-full h-[500px] flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Code Editor</CardTitle>
            <div className="flex gap-4">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExecuteCode} disabled={isExecuting}>
                {isExecuting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Run
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div
            ref={editorRef}
            className="h-full w-full border rounded-md overflow-hidden"
          />
        </CardContent>
      </Card>

      {isConsoleVisible && (
        <Card className="w-full h-[200px]">
          <CardHeader className="py-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm">Console Output</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConsoleVisible(false)}
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[120px] w-full rounded-md border p-4 bg-black/90">
              {executionResult?.error ? (
                <Alert variant="destructive">
                  <AlertDescription className="font-mono text-sm whitespace-pre-wrap">
                    {executionResult.error}
                  </AlertDescription>
                </Alert>
              ) : (
                <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                  {executionResult?.output || "No output"}
                </pre>
              )}
              {executionResult?.execution_time && (
                <div className="text-xs text-gray-400 mt-2">
                  Execution time: {executionResult.execution_time}ms
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeEditor;
