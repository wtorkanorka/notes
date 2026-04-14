import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

import { useNotesStore } from "@/hooks/store";
import { Note } from "@/types/type";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import CustomButton from "./custom-button";

export const NoteListComponent = ({ note }: { note: Note }) => {
  const router = useRouter();
  const useNotesStoreHook = useNotesStore();
  const deleteNote = useNotesStoreHook.deleteNote;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({ pathname: "/(tabs)/note", params: { id: note.id } })
      }
    >
      <ThemedView
        lightColor={note.color + "20"}
        darkColor={note.color + "30"}
        style={styles.noteCard}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <ThemedText type="subtitle" style={styles.noteTitle}>
            {note.title}
          </ThemedText>
          <CustomButton
            pressFnc={() => {
              const result = deleteNote(note.id);
              if (result.status === "successful") {
                Alert.alert("Успех", result.message || "Заметка удалена");
              } else {
                Alert.alert("Ошибка", result.message || "Не удалось удалить");
              }
            }}
          >
            <Text style={{ color: "white" }}>Удалить</Text>
          </CustomButton>
        </View>
        <ThemedText style={styles.noteContent} numberOfLines={3}>
          {note.content}
        </ThemedText>
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.map((tag) => (
              <ThemedView
                key={tag}
                lightColor="#E3F2FD"
                darkColor="#374151"
                style={styles.tagChip}
              >
                <ThemedText type="defaultSemiBold" style={styles.tagText}>
                  {tag}
                </ThemedText>
              </ThemedView>
            ))}
          </View>
        )}
        <View style={styles.noteFooter}>
          <ThemedText type="default" style={styles.dateText}>
            Создано: {new Date(note.createdAt).toLocaleDateString("ru-RU")}
          </ThemedText>
          <ThemedText type="default" style={styles.dateText}>
            Изм.: {new Date(note.modifiedAt).toLocaleDateString("ru-RU")}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

  noteCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  noteTitle: {
    marginBottom: 8,
    color: "#FFFFFF",
  },
  noteContent: {
    marginBottom: 12,
    lineHeight: 22,
    color: "#F0F0F0",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tagChip: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#1976D2",
  },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 12,
    opacity: 0.8,
  },
});
