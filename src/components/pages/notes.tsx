  import React, { useEffect, useState } from 'react';
  import { Card } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { Dialog, DialogContent } from "@/components/ui/dialog";
  import Cookies from "js-cookie";
  import { Header } from '../header';
  import { Plus, Pin, Trash2, Search, Maximize2, Minimize2 } from "lucide-react";

  interface Note {
    id: number;
    title: string;
    content: string;
    color: string;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
  }

  export const NotesGrid: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [maximizedNote, setMaximizedNote] = useState<Note | null>(null);

    useEffect(() => {
      fetchNotes();
    }, []);

    const accessToken = Cookies.get("access_token");

    const fetchNotes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/notes/note/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
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
            'Authorization': `Bearer ${accessToken}`,
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
            'Authorization': `Bearer ${accessToken}`,
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
            'Authorization': `Bearer ${accessToken}`,
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
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) throw new Error('Failed to delete note');

        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    };

    const handleMaximize = (note: Note) => {
      setMaximizedNote(note);
    };

    const handleMinimize = () => {
      setMaximizedNote(null);
    };

    const handleMaximizedNoteUpdate = (updates: Partial<Note>) => {
      if (maximizedNote) {
        updateNote(maximizedNote.id, updates);
        setMaximizedNote(prev => prev ? { ...prev, ...updates } : null);
      }
    };

    const filteredNotes = notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinnedNotes = filteredNotes.filter((note) => note.is_pinned);
    const unpinnedNotes = filteredNotes.filter((note) => !note.is_pinned);

    if (loading) {
      return <div>Loading...</div>;
    }


    return (
      <>
      <Header/>
        <div className="p-4">
          <div className="mb-6 flex gap-4 items-center">
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
              prefix={<Search className="h-4 w-4 text-gray-400" />}
            />
            <Button onClick={createNote}>
              <Plus className="h-4 w-4 mr-2" /> New Note
            </Button>
          </div>

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
                    onMaximize={handleMaximize}
                  />
                ))}
              </div>
            </>
          )}

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
                    onMaximize={handleMaximize}
                  />
                ))}
              </div>
            </>
          )}

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchQuery ? 'No matching notes found' : 'No notes yet. Create one!'}
              </div>
            </div>
          )}

          <Dialog open={maximizedNote !== null} onOpenChange={() => setMaximizedNote(null)}>
            <DialogContent className="sm:max-w-[90vw] sm:h-[90vh] max-w-full h-[95vh]">
              {maximizedNote && (
                <div className="flex flex-col h-full">
                  <div className="flex-grow overflow-y-auto p-4">
                    <input
                      type="text"
                      value={maximizedNote.title}
                      onChange={(e) => handleMaximizedNoteUpdate({ title: e.target.value })}
                      placeholder="Title"
                      className="w-full bg-transparent border-none focus:outline-none text-xl font-medium mb-4"
                    />
                    <textarea
                      value={maximizedNote.content}
                      onChange={(e) => handleMaximizedNoteUpdate({ content: e.target.value })}
                      placeholder="Take a note..."
                      className="w-full bg-transparent border-none focus:outline-none resize-none min-h-[calc(100%-4rem)]"
                    />
                  </div>
                  <div className="border-t p-4 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePin(maximizedNote.id)}
                      className={maximizedNote.is_pinned ? 'text-violet-600 dark:text-violet-400' : ''}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        deleteNote(maximizedNote.id);
                        handleMinimize();
                      }}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </>
    );
  };

  const NoteCard: React.FC<{
    note: Note;
    onUpdate: (id: number, updates: Partial<Note>) => void;
    onDelete: (id: number) => void;
    onPin: (id: number) => void;
    onMaximize: (note: Note) => void;
  }> = ({ note, onUpdate, onDelete, onPin, onMaximize }) => {
    return (
      <Card className={`overflow-hidden ${note.is_pinned ? 'border-violet-500 dark:border-violet-400' : ''}`}>
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
            onClick={() => onMaximize(note)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onPin(note.id)}
            className={note.is_pinned ? 'text-violet-600 dark:text-violet-400' : ''}
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

  export default NotesGrid;