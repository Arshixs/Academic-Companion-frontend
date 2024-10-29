import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pin, Archive, Trash2, Search } from "lucide-react";
import Cookies from "js-cookie";

interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export const NotesGrid: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const accessToken = Cookies.get("access_token"); // Retrieve access token from cookies

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/notes/note/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include authorization header
        },
      });
      if (!response.ok) throw new Error('Failed to fetch notes');

      const data: Note[] = await response.json();
      console.log('Fetched notes:', data);

      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        console.error('Expected an array of notes, but got:', data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/notes/note/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Include authorization header
        },
        body: JSON.stringify({
          title: '',
          content: '',
          color: 'default',
        }),
      });
      if (!response.ok) throw new Error('Failed to create note');

      const newNote: Note = await response.json();
      setNotes((prevNotes) => [newNote, ...prevNotes]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateNote = async (id: number, updates: Partial<Note>) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/notes/note/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Include authorization header
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update note');

      const updatedNote: Note = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? updatedNote : note))
      );
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const togglePin = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/notes/note/${id}/toggle_pin/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include authorization header
        },
      });
      if (!response.ok) throw new Error('Failed to toggle pin');

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? { ...note, is_pinned: !note.is_pinned } : note))
      );
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/notes/note/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include authorization header
        },
      });
      if (!response.ok) throw new Error('Failed to delete note');

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const archiveNote = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/notes/note/${id}/toggle_archive/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include authorization header
        },
      });
      if (!response.ok) throw new Error('Failed to archive note');

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((note) => note.is_pinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.is_pinned);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search notes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={createNote} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" /> New Note
        </Button>
      </div>

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <>
          <h2 className="text-lg font-medium mb-4">Pinned</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={updateNote}
                onDelete={deleteNote}
                onPin={togglePin}
                onArchive={archiveNote}
              />
            ))}
          </div>
        </>
      )}

      {/* Other Notes Section */}
      {unpinnedNotes.length > 0 && (
        <>
          <h2 className="text-lg font-medium mb-4">Others</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={updateNote}
                onDelete={deleteNote}
                onPin={togglePin}
                onArchive={archiveNote}
              />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No matching notes found' : 'No notes yet. Create one!'}
          </p>
        </div>
      )}
    </div>
  );
};

// Note Card Component
const NoteCard: React.FC<{
  note: Note;
  onUpdate: (id: number, updates: Partial<Note>) => void;
  onDelete: (id: number) => void;
  onPin: (id: number) => void;
  onArchive: (id: number) => void;
}> = ({ note, onUpdate, onDelete, onPin, onArchive }) => {
  return (
    <Card className={`overflow-hidden ${note.is_pinned ? 'border-yellow-500 dark:border-yellow-400' : ''}`}>
      <div className="p-4">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdate(note.id, { title: e.target.value })}
          placeholder="Title"
          className="w-full bg-transparent border-none focus:outline-none text-lg font-medium mb-2"
        />
        <textarea
          value={note.content}
          onChange={(e) => onUpdate(note.id, { content: e.target.value })}
          placeholder="Take a note..."
          className="w-full bg-transparent border-none focus:outline-none resize-none min-h-[100px]"
        />
      </div>
      
      <div className="border-t p-2 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onPin(note.id)}
          className={note.is_pinned ? 'text-yellow-600 dark:text-yellow-400' : ''}
        >
          <Pin className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onArchive(note.id)}>
          <Archive className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(note.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default NotesGrid;
