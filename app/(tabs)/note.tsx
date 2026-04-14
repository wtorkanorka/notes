import CustomButton from "@/components/custom-button";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useNotesStore } from "@/hooks/store";
import { Note } from "@/types/type";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const useNotesStoreHook = useNotesStore();
  const deleteNote = useNotesStoreHook.deleteNote;
  const updateNote = useNotesStoreHook.updateNote;
  const notes = useNotesStoreHook.notes;
  const note = notes.find((n: Note) => n.id === id) as Note | undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTagText, setNewTagText] = useState("");

  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags || []);
    }
  }, [note]);

  const handleSave = () => {
    const res = updateNote(id!, {
      title: editTitle,
      content: editContent,
      tags: editTags,
    });
    if (res.status === "successful") {
      Alert.alert("Успех", res.message);
      setIsEditing(false);
    } else {
      Alert.alert("Ошибка", res.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTagText.trim()) {
      setEditTags([...editTags, newTagText.trim()]);
      setNewTagText("");
    }
  };

  const handleDeleteTag = (index: number) => {
    setEditTags(editTags.filter((_, i) => i !== index));
  };

  if (!note) {
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
        <Text>Заметка не найдена</Text>
      </ParallaxScrollView>
    );
  }

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {isEditing && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <CustomButton
              pressFnc={handleCancel}
              btnStyle={styles.btnSecondary}
            >
              <Text style={styles.btnText}>Отмена</Text>
            </CustomButton>
            <CustomButton pressFnc={handleSave} btnStyle={styles.btnPrimary}>
              <Text style={styles.btnText}>Сохранить</Text>
            </CustomButton>
          </View>
        )}

        {isEditing ? (
          <>
            <TextInput
              style={styles.editTitle}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Название"
              multiline
            />
            <TextInput
              style={styles.editContent}
              value={editContent}
              onChangeText={setEditContent}
              placeholder="Содержание"
              multiline
              textAlignVertical="top"
            />
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Теги</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  value={newTagText}
                  onChangeText={setNewTagText}
                  placeholder="Новый тег"
                />
                <CustomButton
                  pressFnc={handleAddTag}
                  btnStyle={styles.addTagBtn}
                >
                  <Text style={{ ...styles.btnText, fontSize: 40 }}>+</Text>
                </CustomButton>
              </View>
              <View style={styles.tagsList}>
                {editTags.map((tag, index) => (
                  <View key={index} style={styles.editTagChip}>
                    <Text style={styles.editTagText}>{tag}</Text>
                    <CustomButton
                      pressFnc={() => handleDeleteTag(index)}
                      btnStyle={styles.deleteTagBtn}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                        }}
                      >
                        x
                      </Text>
                    </CustomButton>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            <ThemedText type="title" style={styles.title}>
              {note.title}
            </ThemedText>
            <ThemedText style={styles.content}>{note.content}</ThemedText>
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
          </>
        )}

        <View style={styles.footer}>
          <ThemedText type="default" style={styles.dateText}>
            Создано: {new Date(note.createdAt).toLocaleString("ru-RU")}
          </ThemedText>
          <ThemedText type="default" style={styles.dateText}>
            Изм.: {new Date(note.modifiedAt).toLocaleString("ru-RU")}
          </ThemedText>
        </View>

        {!isEditing && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <CustomButton
              pressFnc={() => setIsEditing(true)}
              btnStyle={styles.editBtn}
            >
              <Text style={styles.btnText}>Редактировать</Text>
            </CustomButton>
            <CustomButton
              btnStyle={styles.deleteBtn}
              pressFnc={() => {
                const res = deleteNote(note.id);
                if (res.status === "successful") {
                  Alert.alert("Успех", res.message);
                  router.back();
                } else {
                  Alert.alert("Ошибка", res.message);
                }
              }}
            >
              <Text style={styles.deleteBtnText}>Удалить заметку</Text>
            </CustomButton>
          </View>
        )}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tagChip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateText: {
    opacity: 0.8,
  },
  editTitle: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    backgroundColor: "white",
    minHeight: 50,
  },
  editContent: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: "top",
    backgroundColor: "white",
    marginBottom: 20,
  },
  tagsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "white",
  },
  tagInputContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "white",
  },
  addTagBtn: {
    minWidth: 50,
    paddingHorizontal: 0,
    fontSize: 30,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  editTagChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editTagText: {
    marginRight: 8,
    fontSize: 14,
    color: "#1976d2",
  },
  deleteTagBtn: {
    backgroundColor: "#1976d2",
    minWidth: 24,
    minHeight: 24,
    borderRadius: 12,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btnPrimary: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
  },
  btnSecondary: {
    backgroundColor: "#f44336",
    borderRadius: 20,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    padding: 5,
  },
  editBtn: {
    backgroundColor: "#2196F3",
    // padding: 5,
    borderRadius: 20,
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    padding: 5,
    borderRadius: 20,
  },
  deleteBtnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
