import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play,
  Download,
  Copy,
  RotateCcw,
  Loader2,
  Save,
  FolderOpen,
  Star,
  Clock,
  Trash
} from "lucide-react";
import { useTheme } from "next-themes";
import Header from "../header";
import Cookies from "js-cookie";

type Language = "python" | "cpp" | "c" | "javascript";

const CodeEditor = () => {
  interface Snippet {
    id: number;
    title: string;
    description: string;
    code: string;
    language: Language;
    is_public: boolean;
    created_at: string;
  }

  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  const [snippetTitle, setSnippetTitle] = useState<string>("");
  const [snippetDescription, setSnippetDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [savedSnippets, setSavedSnippets] = useState<Array<Snippet>>([]);
  const [isSavedSnippetsLoading, setIsSavedSnippetsLoading] =useState<boolean>(false);

  const { theme } = useTheme();
  const accessToken = Cookies.get("access_token");



  // Fetch saved snippets
  const fetchSavedSnippets = async (): Promise<void> => {
    setIsSavedSnippetsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/code/code", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // Expecting an array of snippets
        const data: Snippet[] = await response.json();
        // console.log(data);
        setSavedSnippets(data);
      } else {
        throw new Error("Failed to fetch snippets");
      }
    } catch (error) {
      console.error("Error fetching snippets:", error);
    } finally {
      setIsSavedSnippetsLoading(false);
    }
  };


  useEffect(() => {
    fetchSavedSnippets();
  }, []);

  const handleSaveSnippet = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(
        JSON.stringify({
          title: snippetTitle,
          description: snippetDescription,
          code,
          language,
          is_public: isPublic,
        })
      );
      const response = await fetch("http://127.0.0.1:8000/code/code/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          code,
          language,
          save: true, // Use `save` instead of `save_snippet`
          title: snippetTitle,
          description: snippetDescription,
          is_public: isPublic,
        }),
      });

      if (response.ok) {
        setSaveDialogOpen(false);
        fetchSavedSnippets();
        // Reset form
        setSnippetTitle("");
        setSnippetDescription("");
        setIsPublic(false);
      } else {
        throw new Error("Failed to save snippet");
      }
    } catch (error) {
      setError("Failed to save snippet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSnippet = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/code/code/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // Filter out the deleted snippet from the saved snippets list
        setSavedSnippets((prevSnippets) =>
          prevSnippets.filter((snippet) => snippet.id !== id)
        );
      } else {
        throw new Error("Failed to delete snippet");
      }
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };



  const loadSnippet = (snippet:Snippet): void => {
    setLanguage(snippet.language);
    setCode(snippet.code);
    setActiveTab("editor");
  };

  const languageOptions = [
    { value: "python", label: "Python", icon: "🐍" },
    { value: "cpp", label: "C++", icon: "⚡" },
    { value: "c", label: "C", icon: "🔧" },
    { value: "javascript", label: "JavaScript", icon: "📱" },
  ];

  const defaultCode: Record<Language, string> = {
    python:
      '# Write your Python code here\n\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()',
    cpp: '// Write your C++ code here\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    c: '// Write your C code here\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    javascript:
      '// Write your JavaScript code here\nfunction main() {\n    console.log("Hello, World!");\n}\n\nmain();',
  };

  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setError("");
    setOutput("");
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setError("");
    setOutput("");
    setActiveTab("output");

    try {
      const response = await fetch("http://127.0.0.1:8000/code/code/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          language,
          code,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setOutput(
          data.output || "Program executed successfully with no output."
        );
      }
    } catch (error) {
      setError("Failed to execute code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleReset = () => {
    setCode(defaultCode[language]);
    setOutput("");
    setError("");
  };

  const handleDownload = () => {
    const extensions = {
      python: ".py",
      cpp: ".cpp",
      c: ".c",
      javascript: ".js",
    };

    const blob = new Blob([code], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code${extensions[language]}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-2xl">Online Code Editor</CardTitle>
                <CardDescription>
                  Write, compile, and run code in your browser
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Open Saved Snippets Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Saved Snippets</SheetTitle>
                      <SheetDescription>
                        Your previously saved code snippets
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {isSavedSnippetsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : savedSnippets.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No saved snippets found
                        </div>
                      ) : (
                        savedSnippets.map((snippet) => (
                          <Card
                            key={snippet.id}
                            className="relative cursor-pointer hover:bg-accent/50 p-4" // Adjust padding for readability
                            onClick={() => loadSnippet(snippet)} // Click card to load snippet
                          >
                            <CardHeader className="p-0">
                              {" "}
                              {/* Remove default padding */}
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg font-semibold">
                                    {" "}
                                    {/* Increase font size */}
                                    {snippet.title}
                                  </CardTitle>
                                  <CardDescription className="text-sm text-muted-foreground mt-1">
                                    {snippet.description ||
                                      "No description provided"}
                                  </CardDescription>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  {snippet.is_public && (
                                    <Star className="h-4 w-4" />
                                  )}
                                  <span className="text-xs">
                                    {
                                      languageOptions.find(
                                        (l) => l.value === snippet.language
                                      )?.icon
                                    }
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(
                                  snippet.created_at
                                ).toLocaleDateString()}
                              </div>
                            </CardHeader>

                            {/* Delete button*/}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click action
                                handleDeleteSnippet(snippet.id); // Call the delete function directly
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </Card>
                        ))
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="space-y-4">
                <div className="border rounded-lg overflow-hidden bg-background">
                  <Editor
                    height="500px"
                    language={language}
                    value={code}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    onChange={setCode}
                    options={{
                      fontSize: 14,
                      padding: { top: 16 },
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollbar: {
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10,
                      },
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="output" className="space-y-4">
                <div className="min-h-[500px] p-4 font-mono text-sm border rounded-lg bg-background">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Executing code...</span>
                    </div>
                  ) : error ? (
                    <Alert variant="destructive">
                      <AlertDescription className="whitespace-pre-wrap font-mono">
                        {error}
                      </AlertDescription>
                    </Alert>
                  ) : output ? (
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Run your code to see the output here
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCode(defaultCode[language])}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>

                {/* Save Dialog */}
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Code Snippet</DialogTitle>
                      <DialogDescription>
                        Save your code snippet for later use
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter snippet title"
                          value={snippetTitle}
                          onChange={(e) => setSnippetTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter snippet description"
                          value={snippetDescription}
                          onChange={(e) =>
                            setSnippetDescription(e.target.value)
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="public"
                          checked={isPublic}
                          onCheckedChange={setIsPublic}
                        />
                        <Label htmlFor="public">Make public</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={handleSaveSnippet}
                        disabled={!snippetTitle || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          "Save Snippet"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Button
                size="sm"
                onClick={handleRunCode}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isLoading ? "Running..." : "Run Code"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CodeEditor;
