// services/fileStorage.js
import { Directory, File, Paths } from "expo-file-system";

// Директория для хранения заметок (объект Directory, а не строка!)
let notesDirectory: any | null = null;

/**
 * Получение директории заметок (ленивая инициализация)
 * @returns {Promise<Directory>}
 */
const getNotesDirectory = async () => {
  if (!notesDirectory) {
    notesDirectory = new Directory(Paths.document, "notes");
  }
  return notesDirectory;
};

/**
 * Инициализация файлового хранилища
 * Создает необходимые директории и файлы, если они не существуют
 */
export const initFileStorage = async () => {
  try {
    const notesDir = await getNotesDirectory();

    // Проверяем, существует ли директория через свойство exists
    if (!notesDir.exists) {
      // Создаем директорию (intermediates: true создает все вложенные папки)
      await notesDir.create({ intermediates: true });
      console.log("📁 Директория для заметок создана:", notesDir.uri);
    }

    // Проверяем, существует ли индексный файл
    const indexPath = new File(notesDir, "index.json");

    if (!indexPath.exists) {
      // Создаем пустой индексный файл
      indexPath.create();
      indexPath.write("[]");
      console.log("📄 Индексный файл создан");
    }

    return true;
  } catch (error) {
    console.error("❌ Ошибка инициализации файлового хранилища:", error);
    return false;
  }
};

/**
 * Получение всех заметок из индексного файла
 * @returns {Promise<Array>} Массив заметок
 */
export const getAllNotesFromFiles = async () => {
  try {
    const notesDir = await getNotesDirectory();
    const indexPath = new File(notesDir, "index.json");

    if (!indexPath.exists) {
      return [];
    }

    // Читаем содержимое файла (синхронно или асинхронно)
    const content = indexPath.textSync(); // или await indexPath.text()
    const notes = JSON.parse(content);

    // Сортируем по дате обновления (новые сверху)
    return notes.sort((a: any, b: any) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error("❌ Ошибка чтения списка заметок:", error);
    return [];
  }
};

/**
 * Сохранение заметки в файл и обновление индекса
 * @param {Object} note - Объект заметки с полями id, title, content, updatedAt
 * @returns {Promise<boolean>} - Успех операции
 */
export const saveNoteToFile = async (note: any) => {
  try {
    const notesDir = await getNotesDirectory();

    // Создаем файл заметки (имя файла = id заметки + .json)
    const noteFile = new File(notesDir, `${note.id}.json`);

    // Если файл не существует, создаём его
    if (!noteFile.exists) {
      noteFile.create();
    }

    // Сохраняем содержимое
    noteFile.write(JSON.stringify(note, null, 2));

    // Обновляем индекс
    const currentNotes = await getAllNotesFromFiles();
    const existingIndex = currentNotes.findIndex((n: any) => n.id === note.id);

    if (existingIndex !== -1) {
      currentNotes[existingIndex] = note;
    } else {
      currentNotes.push(note);
    }

    // Сохраняем индекс
    const indexPath = new File(notesDir, "index.json");
    indexPath.write(JSON.stringify(currentNotes, null, 2));

    console.log(`✅ Заметка "${note.title}" сохранена в файл`);
    return true;
  } catch (error) {
    console.error("❌ Ошибка сохранения заметки в файл:", error);
    return false;
  }
};

/**
 * Сохранение всех заметок (массовая операция)
 * @param {Array} notes - Массив всех заметок
 * @returns {Promise<boolean>} - Успех операции
 */
export const saveAllNotesToFiles = async (notes: any) => {
  try {
    const notesDir = await getNotesDirectory();

    // Сохраняем каждую заметку в отдельный файл
    for (const note of notes) {
      const noteFile = new File(notesDir, `${note.id}.json`);
      if (!noteFile.exists) {
        noteFile.create();
      }
      noteFile.write(JSON.stringify(note, null, 2));
    }

    // Сохраняем индексный файл
    const indexPath = new File(notesDir, "index.json");
    indexPath.write(JSON.stringify(notes, null, 2));

    console.log(`✅ Сохранено ${notes.length} заметок в файлы`);
    return true;
  } catch (error) {
    console.error("❌ Ошибка массового сохранения заметок:", error);
    return false;
  }
};

/**
 * Получение одной заметки по ID
 * @param {string} id - ID заметки
 * @returns {Promise<Object|null>} - Объект заметки или null
 */
export const getNoteFromFile = async (id: any) => {
  try {
    const notesDir = await getNotesDirectory();
    const noteFile = new File(notesDir, `${id}.json`);

    if (!noteFile.exists) {
      return null;
    }

    const content = noteFile.textSync();
    return JSON.parse(content);
  } catch (error) {
    console.error("❌ Ошибка чтения заметки из файла:", error);
    return null;
  }
};

/**
 * Удаление заметки по ID
 * @param {string} id - ID заметки для удаления
 * @returns {Promise<boolean>} - Успех операции
 */
export const deleteNoteFromFile = async (id: any) => {
  try {
    const notesDir = await getNotesDirectory();

    // Удаляем файл заметки
    const noteFile = new File(notesDir, `${id}.json`);
    if (noteFile.exists) {
      await noteFile.delete();
    }

    // Обновляем индекс
    const currentNotes = await getAllNotesFromFiles();
    const updatedNotes = currentNotes.filter((note: any) => note.id !== id);

    const indexPath = new File(notesDir, "index.json");
    indexPath.write(JSON.stringify(updatedNotes, null, 2));

    console.log(`🗑️ Заметка с ID ${id} удалена`);
    return true;
  } catch (error) {
    console.error("❌ Ошибка удаления заметки:", error);
    return false;
  }
};

/**
 * Очистка всех заметок (удаление директории)
 * @returns {Promise<boolean>} - Успех операции
 */
export const clearAllNotesFiles = async () => {
  try {
    const notesDir = await getNotesDirectory();

    if (notesDir.exists) {
      await notesDir.delete();
    }

    // Создаем заново пустую структуру
    notesDirectory = null; // Сбрасываем кеш
    await initFileStorage();

    console.log("🗑️ Все заметки очищены");
    return true;
  } catch (error) {
    console.error("❌ Ошибка очистки заметок:", error);
    return false;
  }
};

/**
 * Экспорт всех заметок в JSON файл (для бэкапа)
 * @returns {Promise<string|null>} - Путь к файлу экспорта
 */
export const exportNotesToBackup = async () => {
  try {
    const notes = await getAllNotesFromFiles();
    const backupFile = new File(
      Paths.document,
      `backup_notes_${Date.now()}.json`,
    );

    if (!backupFile.exists) {
      backupFile.create();
    }

    backupFile.write(JSON.stringify(notes, null, 2));

    console.log(`💾 Бэкап создан: ${backupFile.uri}`);
    return backupFile.uri;
  } catch (error) {
    console.error("❌ Ошибка создания бэкапа:", error);
    return null;
  }
};
