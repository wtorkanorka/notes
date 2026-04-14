import CustomButton from "@/components/custom-button";
import { NoteListComponent } from "@/components/note-list-component";
import ParallaxScrollView from "@/components/parallax-scroll-view";

import { useNotesStore, useStoreOnMobile } from "@/hooks/store";
import { type Note } from "@/types/type";

import { Ionicons } from "@expo/vector-icons";

import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";

export default function HomeScreen() {
  const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newTextTitle, setNewTextTitle] = useState("");
  const [newTextDescription, setNewTextDescription] = useState("");
  const [newTagText, setNewTagText] = useState("");
  const [newTagsArr, setNewTagsArr] = useState<string[]>([]);

  const useNotesStoreHook = useNotesStore();
  const useStoreonMobileHook = useStoreOnMobile();
  const storeNotes = useNotesStoreHook.notes;
  const addNote = useNotesStoreHook.addNote;

  const handleCloseCreatingContainer = useCallback(() => {
    setNewTextDescription("");
    setNewTextTitle("");
    setNewTagsArr([]);
    setNewTagText("");
    setIsCreatingNewNote(false);
  }, []);

  const handleCreateNewNote = useCallback(() => {
    const newNote: Note = {
      title: newTextTitle,
      content: newTextDescription,
      tags: newTagsArr,
      id: uuid.v4() as string,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    if (newTextTitle.trim() === "") {
      Alert.alert("Название пустое");
      return;
    }
    if (newTextDescription.trim() === "") {
      Alert.alert("Описание пустое");
      return;
    }
    addNote(newNote);
    handleCloseCreatingContainer();
  }, [
    newTextTitle,
    newTextDescription,
    newTagsArr,
    addNote,
    handleCloseCreatingContainer,
  ]);

  const handleAddNewTag = useCallback(() => {
    if (newTagText.trim()) {
      setNewTagsArr((prev) => [...prev, newTagText.trim()]);
      setNewTagText("");
    }
  }, [newTagText]);

  const handleDeleteTag = useCallback((index: number) => {
    setNewTagsArr((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Поиск функция
  const filteredNotes = useCallback((notes: Note[], query: string): Note[] => {
    if (!query.trim()) return notes;

    const lowerQuery = query.toLowerCase().trim();
    const isDateQuery = !isNaN(Date.parse(query));

    return notes.filter((note) => {
      // По названию
      if (note.title.toLowerCase().includes(lowerQuery)) return true;
      // По содержимому
      if (note.content.toLowerCase().includes(lowerQuery)) return true;
      // По тегам
      if (
        note.tags &&
        note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
        return true;
      // По дате/времени
      if (isDateQuery) {
        const noteDate = new Date(note.createdAt);
        const noteModified = new Date(note.modifiedAt);
        if (
          noteDate.toDateString().includes(lowerQuery) ||
          noteModified.toDateString().includes(lowerQuery)
        )
          return true;
      }
      return false;
    });
  }, []);

  const sortedNotes = useMemo(() => {
    const notes = filteredNotes(storeNotes, searchQuery);
    return [...notes].sort(
      (a: Note, b: Note) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
    );
  }, [storeNotes, searchQuery, filteredNotes]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <CustomButton
        pressFnc={() => {
          useStoreonMobileHook.changeStore();
        }}
        btnStyle={{
          display: "flex",
          flexDirection: "row",

          justifyContent: "center",

          borderRadius: 20,
          padding: 10,
          backgroundColor: "#007AFF",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Сменить способ хранения, текущее хранилище -
          {useStoreonMobileHook.storeType}
        </Text>
      </CustomButton>

      {isCreatingNewNote ? (
        <View style={styles.creatingNewNoteBlock}>
          <View>
            <TextInput
              style={{
                backgroundColor: "white",
                borderRadius: 18,
                marginBottom: 10,
              }}
              placeholder="Название"
              onChangeText={setNewTextTitle}
            />
            <TextInput
              style={{
                backgroundColor: "white",
                borderRadius: 18,
                marginBottom: 10,
              }}
              placeholder="Содержание"
              onChangeText={setNewTextDescription}
            />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            {newTagsArr.map((tag, index) => (
              <CustomButton
                btnStyle={styles.tagButton}
                pressFnc={() => handleDeleteTag(index)}
                key={index}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </CustomButton>
            ))}
            <TextInput
              style={styles.tagInput}
              placeholder="Тег"
              onChangeText={setNewTagText}
              value={newTagText}
            />
            <CustomButton
              pressFnc={handleAddNewTag}
              btnStyle={styles.tagButton}
            >
              <Text>+</Text>
            </CustomButton>
          </View>

          <View style={styles.creatingBlockButtonsContainer}>
            <CustomButton
              btnStyle={{
                backgroundColor: "red",
                padding: 10,
                borderRadius: 20,
              }}
              pressFnc={handleCloseCreatingContainer}
            >
              <Text style={{ color: "white" }}>Отмена</Text>
            </CustomButton>
            <CustomButton
              btnStyle={{
                backgroundColor: "green",
                padding: 10,
                borderRadius: 20,
              }}
              pressFnc={handleCreateNewNote}
            >
              <Text style={{ color: "white" }}>Сохранить</Text>
            </CustomButton>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setIsCreatingNewNote(true);
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Создать новую заметку
          </Text>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск"
          value={searchQuery}
          placeholderTextColor={"white"}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <CustomButton
            pressFnc={() => setSearchQuery("")}
            btnStyle={styles.clearSearchBtn}
          >
            <Text style={styles.clearSearchText}>X</Text>
          </CustomButton>
        ) : null}
      </View>
      <ScrollView
        style={{ position: "relative" }}
        showsVerticalScrollIndicator={false}
      >
        {sortedNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color="rgba(255,255,255,0.5)" />
            <Text style={styles.emptyText}>
              {searchQuery ? "Ничего не найдено" : "Нет заметок"}
            </Text>
            {searchQuery && (
              <Text style={styles.emptySubText}>
                Попробуйте другие ключевые слова
              </Text>
            )}
          </View>
        ) : (
          sortedNotes.map((note: Note) => (
            <NoteListComponent key={note.id} note={note} />
          ))
        )}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  fab: {
    display: "flex",
    flexDirection: "row",
    right: 0,
    left: 0,
    top: 0,
    justifyContent: "center",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  creatingNewNoteBlock: {
    display: "flex",
    padding: 20,
    right: 0,
    left: 0,
    top: 0,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  creatingBlockButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  tagButton: {
    backgroundColor: "lightblue",
    margin: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    marginRight: 8,
  },
  tagInput: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 10,
    margin: 2,
    minWidth: 60,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
    paddingHorizontal: 16,

    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    color: "white",
    paddingVertical: 12,
    fontSize: 16,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
});
