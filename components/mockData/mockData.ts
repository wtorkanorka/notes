import { Note } from "@/types/type";

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Первая заметка",
    content:
      "Это первая тестовая заметка с некоторым содержимым. Здесь можно написать идеи, задачи или заметки.",
    tags: ["работа", "идея"],
    createdAt: new Date("2024-01-15"),
    modifiedAt: new Date("2024-01-16"),
  },
  {
    id: "2",
    title: "Покупки",
    content:
      "Список покупок: молоко, хлеб, яйца, фрукты. Не забыть купить кофе!",
    tags: ["покупки", "еда"],
    createdAt: new Date("2024-01-20"),
    modifiedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    title: "Идея для проекта",
    content:
      "Разработать мобильное приложение для заметок с тегами и Zustand. Функции: CRUD, search by tag, dark mode.",
    tags: ["проект", "react native", "zustand"],
    createdAt: new Date("2024-01-22"),
    modifiedAt: new Date("2024-01-25"),
  },
  {
    id: "4",
    title: "Встреча завтра",
    content:
      "Встреча с командой в 14:00. Обсудить roadmap, deadlines, features.",
    tags: ["встреча", "команда"],
    createdAt: new Date("2024-01-28"),
    modifiedAt: new Date("2024-01-28"),
  },
  {
    id: "5",
    title: "Рецепт пиццы",
    content:
      "Тесто: мука 300г, вода 200мл, дрожжи 7г. Топпинг: томатный соус, сыр моцарелла, салями.",
    tags: ["рецепт", "пицца", "кулинария"],
    createdAt: new Date("2024-01-30"),
    modifiedAt: new Date("2024-02-01"),
  },
  {
    id: "6",
    title: "Книга по JS",
    content:
      "Читаю 'You Don't Know JS'. Глава про closures и scope. Интересно!",
    tags: ["книга", "javascript"],
    createdAt: new Date("2024-02-02"),
    modifiedAt: new Date("2024-02-05"),
  },
  {
    id: "7",
    title: "Тренировка",
    content:
      "Сегодня: приседания 3x10, отжимания 3x15, бег 5км. Хорошо прошло.",
    tags: ["спорт", "тренировка"],
    createdAt: new Date("2024-02-07"),
    modifiedAt: new Date("2024-02-07"),
  },
  {
    id: "8",
    title: "Фильм посмотреть",
    content: "Рекомендации: Inception, Interstellar, Dune. Weekend plan.",
    tags: ["фильмы", "watchlist"],
    createdAt: new Date("2024-02-10"),
    modifiedAt: new Date("2024-02-10"),
  },
  {
    id: "9",
    title: "Бюджет месяц",
    content:
      "Доходы: 50000. Расходы: еда 10000, транспорт 3000, развлечения 5000. Остаток 32000.",
    tags: ["финансы", "бюджет"],
    createdAt: new Date("2024-02-12"),
    modifiedAt: new Date("2024-02-15"),
  },
  {
    id: "10",
    title: "Подарок другу",
    content:
      "День рождения 15 марта. Идеи: книга, наушники, сертификат в кино.",
    tags: ["подарок", "друг"],
    createdAt: new Date("2024-02-20"),
    modifiedAt: new Date("2024-02-20"),
  },
];

export type { Note };
