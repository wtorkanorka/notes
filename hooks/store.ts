import { mockNotes } from "@/components/mockData/mockData";
import { Note } from "@/types/type";
import { create } from "zustand";

interface INotesStore {
  notes: Note[];
  addNote: (newNote: Note) => void;
  deleteNote: (noteId: string) => {
    status: "successful" | "failed";
    message: string;
  };
  updateNote: (
    noteId: string,
    updates: Partial<Note>,
  ) => {
    status: "successful" | "failed";
    message: string;
  };
}
interface IStoreOnMobile {
  storeType: "SQLite" | "LocalStorage";
  changeStore: () => void;
}

export const useStoreOnMobile = create<IStoreOnMobile>((set, get) => ({
  storeType: "SQLite",
  changeStore: () =>
    set((state) => ({
      storeType: state.storeType == "SQLite" ? "LocalStorage" : "SQLite",
    })),
}));

export const useNotesStore = create<INotesStore>((set, get) => ({
  notes: mockNotes,
  addNote: (newNote) => set((state) => ({ notes: [...state.notes, newNote] })),
  deleteNote: (noteId) => {
    const state = get();
    const noteIndex = state.notes.findIndex((note) => note.id === noteId);
    if (noteIndex === -1) {
      return { status: "failed" as const, message: "Заметка не найдена" };
    }
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== noteId),
    }));
    return { status: "successful" as const, message: "Заметка удалена" };
  },
  updateNote: (noteId, updates) => {
    const state = get();
    const noteIndex = state.notes.findIndex((note) => note.id === noteId);
    if (noteIndex === -1) {
      return { status: "failed" as const, message: "Заметка не найдена" };
    }
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === noteId
          ? { ...note, ...updates, modifiedAt: new Date() }
          : note,
      ),
    }));
    return { status: "successful" as const, message: "Заметка обновлена" };
  },
}));

function handleSaveInSQLiteStorage() {}
function handleSaveInLocalStorage() {}
