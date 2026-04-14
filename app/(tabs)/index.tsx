import CustomButton from "@/components/custom-button";
import { NoteListComponent } from "@/components/note-list-component";
import ParallaxScrollView from "@/components/parallax-scroll-view";

import { useNotesStore } from "@/hooks/store";
import { type Note } from "@/types/type";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";

interface INewNoteData {
  tilte: string | null;
  content: string | null;
  tags: string[] | [];
  id: string;
  createdAt: string;
  modifiedAt: string;
}
const initialNoteObject = {
  tilte: "",
  content: "",
  tags: [""],
  id: "",
  createdAt: "",
  modifiedAt: "",
};
export default function HomeScreen() {
  const router = useRouter();
  const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);

  const [newTextTitle, setNewTextTitle] = useState("");
  const [newTextDescription, setNewTextDescription] = useState("");
  const [newTagText, setNewTagText] = useState("");
  const [newTagsArr, setNewTagsArr] = useState<string[]>([]);

  const useNotesStoreHook = useNotesStore();
  const storeNotes = useNotesStoreHook.notes;
  const addNote = useNotesStoreHook.addNote;

  const sortedNotes = [...storeNotes].sort(
    (a: Note, b: Note) =>
      new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
  );
  const handleCloseCreatingContainer = () => {
    setNewTextDescription("");
    setNewTextTitle("");
    setNewTagsArr([]);
    setNewTagText("");
    setIsCreatingNewNote(false);
  };
  const handleCreateNewNote = () => {
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
  };
  const handleAddNewTag = () => {
    if (newTagText == "") return;
    setNewTagsArr([...newTagsArr, newTagText]);
    setNewTagText("");
  };
  const handleDeleteTag = (index: number) => {
    setNewTagsArr((prev) => prev.filter((_, i) => i !== index));
  };

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
            <Button
              title="Отмена"
              color="red"
              onPress={() => {
                handleCloseCreatingContainer();
              }}
            />
            <Button
              title="Сохранить"
              color="green"
              onPress={handleCreateNewNote}
            />
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            // handleCreateNewNote();
            setIsCreatingNewNote(true);
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Создать новую заметку
          </Text>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
      <ScrollView
        style={{ position: "relative", padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {sortedNotes.length == 0 ? (
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Нет заметок
          </Text>
        ) : (
          sortedNotes.map((note: Note) => (
            <NoteListComponent note={note} key={note.id} />
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
});
