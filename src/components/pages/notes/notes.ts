import axios from 'axios';
import { Note } from './note';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const NotesApi = {
  getAllNotes: () => api.get<Note[]>('/notes/'),
  createNote: (note: Partial<Note>) => api.post<Note>('/notes/', note),
  updateNote: (id: number, note: Partial<Note>) => api.patch<Note>(`/notes/${id}/`, note),
  deleteNote: (id: number) => api.delete(`/notes/${id}/`),
  togglePin: (id: number) => api.post(`/notes/${id}/toggle_pin/`),
  toggleArchive: (id: number) => api.post(`/notes/${id}/toggle_archive/`),
};