import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pin, Trash2, Maximize2 } from "lucide-react";
import { Note } from "./notegrid";
import { Textarea } from "@/components/ui/textarea";

export const NoteCard: React.FC<{
  note: Note;
  onUpdate: (id: number, updates: Partial<Note>) => void;
  onDelete: (id: number) => void;
  onPin: (id: number) => void;
  onMaximize: (note: Note) => void;
}> = ({ note, onUpdate, onDelete, onPin, onMaximize }) => {
  // Local state for both title and content
  const [localTitle, setLocalTitle] = useState(note.title);
  const [localContent, setLocalContent] = useState(note.content);

  // Update local state when props change
  useEffect(() => {
    setLocalTitle(note.title);
    setLocalContent(note.content);
  }, [note.title, note.content]);

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle); // Update local state immediately
    onUpdate(note.id, { title: newTitle }); // Send update to parent
  };

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent); // Update local state immediately
    onUpdate(note.id, { content: newContent }); // Send update to parent
  };

  return (
    <Card
      className={`overflow-hidden ${
        note.is_pinned ? "border-violet-500 dark:border-violet-400" : ""
      }`}
    >
      <div className="p-4">
        <input
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="Title"
          className="w-full bg-transparent border-none focus:outline-none text-lg font-medium mb-2"
        />
        <textarea
          value={localContent}
          onChange={handleContentChange}
          placeholder="Take a note..."
          className="w-full bg-transparent border-none focus:outline-none resize-none min-h-[100px]"
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>

      <div className="border-t p-2 flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => onMaximize(note)}>
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPin(note.id)}
          className={
            note.is_pinned ? "text-violet-600 dark:text-violet-400" : ""
          }
        >
          <Pin className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(note.id)}
          className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
