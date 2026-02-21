# RAG AI Chatbot — Intelligent Document Assistant

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Powered_by-Groq_AI-orange?style=for-the-badge)](https://groq.com/)

An advanced **Retrieval-Augmented Generation (RAG)** chatbot designed for deep document interaction. Upload your PDF, DOCX, or TXT files and engage in a context-aware conversation with a cutting-edge LLM that knows your data inside out.

---

## Technical Showcase

### Core Interface
<!-- Add a high-resolution screenshot of the main chat interface here -->
![Main Interface Preview](https://via.placeholder.com/1200x600/0a0a0a/ffffff?text=Main+Interface+Preview)

### Document Intelligence
<!-- Add a video or GIF showing the document upload and parsing process -->
![Document Upload Process](https://via.placeholder.com/600x400/0a0a0a/ffffff?text=Document+Upload+Process)

---

## Key Features

*   **Deep Document Analysis**: Automatically parses PDF, DOCX, and TXT files using Apache Tika.
*   **Intelligent RAG Engine**: Uses custom vector embedding and cosine similarity for high-precision context retrieval.
*   **Ultra-Fast Responses**: Powered by **Groq Llama-3** (or Gemini) for near-instant inference.
*   **Premium UI/UX**:
    *   Dynamic **Vanta.js** animated backgrounds.
    *   Smooth **Framer Motion** transitions.
    *   Interactive **Three.js** 3D elements (Robot, Globe).
    *   Modern **Tailwind CSS 4** styling with glassmorphism.
*   **Smart Conversation History**: Persistent chat sessions stored in PostgreSQL.
*   **Source Attribution**: Real-time citations showing exactly where the AI found the information.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion, Vanta.js
- **3D/Graphics**: Three.js, @react-three/fiber

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 21
- **Parsing**: Apache Tika
- **Intelligence**: Groq Cloud API / Gemini
- **Database**: PostgreSQL

---

## Project Structure

```text
rag-chatbot/
├── backend/                # Spring Boot Application
│   ├── src/main/java       # Source code (Controller, Service, Repository)
│   ├── pom.xml             # Backend dependencies
│   └── .env                # Backend configuration
├── frontend/               # Next.js Application
│   ├── src/app             # Pages and Layouts
│   ├── src/components      # UI Components (Robot, Chat, etc.)
│   ├── package.json        # Frontend dependencies
│   └── .env.local          # Frontend environment variables
└── README.md               # You are here
```

---

## Getting Started

### 1. Backend Setup
```bash
cd backend
# Create .env file with your credentials
# PORT=8081
# GROQ_API_KEY=your_key_here
# JDBC_DATABASE_URL=jdbc:postgresql://localhost:5432/rag_chatbot
./mvnw spring-boot:run
```

### 2. Frontend Setup
```bash
cd frontend
# Create .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8081/api
npm install
npm run dev
```

---
---

# RAG AI Chatbot — Интеллектуальный помощник по документам

Продвинутый чат-бот на базе **Retrieval-Augmented Generation (RAG)**, разработанный для глубокого взаимодействия с документами. Загружайте файлы PDF, DOCX или TXT и ведите контекстно-зависимый диалог с современным ИИ, который понимает ваши данные.

---

## Демонстрация

### Основной интерфейс
![Main Interface Preview](https://via.placeholder.com/1200x600/0a0a0a/ffffff?text=Main+Interface+Preview)

### Обработка документов
![Document Upload Process](https://via.placeholder.com/600x400/0a0a0a/ffffff?text=Document+Upload+Process)

---

## Ключевые возможности

*   **Глубокий анализ документов**: Автоматический парсинг PDF, DOCX и TXT файлов с помощью Apache Tika.
*   **Интеллектуальный RAG движок**: Использование кастомных векторных эмбеддингов и косинусного сходства для точного поиска контекста.
*   **Мгновенные ответы**: Работает на базе **Groq Llama-3** (или Gemini) для максимально быстрой генерации.
*   **Премиальный UI/UX**:
    *   Динамичные фоны **Vanta.js**.
    *   Плавные переходы на **Framer Motion**.
    *   Интерактивные 3D элементы **Three.js** (Робот, Глобус).
    *   Современная стилизация **Tailwind CSS 4** с эффектами Glassmorphism.
*   **История диалогов**: Постоянные сессии чата, хранящиеся в PostgreSQL.
*   **Цитирование источников**: Отображение конкретных фрагментов документов, использованных при ответе.

---

## Стек технологий

### Frontend
- **Фреймворк**: Next.js 15 (App Router)
- **Язык**: TypeScript
- **Стилизация**: Tailwind CSS 4
- **Анимации**: Framer Motion, Vanta.js
- **3D/Графика**: Three.js, @react-three/fiber

### Backend
- **Фреймворк**: Spring Boot 3.2
- **Язык**: Java 21
- **Парсинг документов**: Apache Tika
- **ИИ логика**: Groq Cloud API / Gemini
- **База данных**: PostgreSQL

---

## Запуск проекта

### 1. Настройка Backend
```bash
cd backend
# Создайте файл .env с вашими доступами
# PORT=8081
# GROQ_API_KEY=ваш_ключ
# JDBC_DATABASE_URL=jdbc:postgresql://localhost:5432/rag_chatbot
./mvnw spring-boot:run
```

### 2. Настройка Frontend
```bash
cd frontend
# Создайте файл .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8081/api
npm install
npm run dev
```

---

*Разработано для сообщества AI-разработчиков.*
