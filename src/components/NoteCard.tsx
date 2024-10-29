import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin, Archive, Trash } from 'lucide-react';
import { Note } from '../components/pages/notes/note';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: number, note: Partial<Note>) => void;
  onDelete: (id: number) => void;
  onPin: (id: number) => void;
  onArchive: (id: number) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onUpdate,
  onDelete,
  onPin,
  onArchive,
}) => {
  return (
    <Card className={`w-72 h-auto ${note.is_pinned ? 'border-yellow-400' : ''}`}>
      <CardHeader className="flex flex-row justify-between items-center p-4">
        <input
          className="text-lg font-semibold bg-transparent border-none focus:outline-none w-full"
          value={note.title}
          onChange={(e) => onUpdate(note.id, { title: e.target.value })}
          placeholder="Title"
        />
      </CardHeader>
      <CardContent className="p-4">
        <textarea
          className="w-full min-h-[100px] bg-transparent border-none resize-none focus:outline-none"
          value={note.content}
          onChange={(e) => onUpdate(note.id, { content: e.target.value })}
          placeholder="Take a note..."
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPin(note.id)}
            className={note.is_pinned ? 'text-yellow-600' : ''}
          >
            <Pin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onArchive(note.id)}
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(note.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};