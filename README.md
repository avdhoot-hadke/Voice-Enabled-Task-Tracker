
# SDE Assignment : Voice-Enabled Task Tracker

A full-stack task management application inspired by Linear, featuring an intelligent Voice-to-Task creation engine. Users can create, update, and manage tasks using a Kanban board or List view, with AI-powered parsing for voice commands.



## Features

- Voice Input: Record audio to automatically populate Task Title, Priority, Status, and Due Date using Generative AI.
- Smart Parsing: Extracts relative dates (e.g., "next Friday") and priorities (e.g., "urgent").
- Kanban Board: Drag-and-drop tasks between statuses (To Do, In Progress, Done).
- List View: A detailed table view for managing tasks efficiently.
- Advanced Filtering: Filter by Search, Priority, Status, and Due Date



## Project Setup

### Prerequisites
   - Node.js (v16 or higher)
   - MongoDB Atlas Connection URI
   - Google Gemini API Key (Free tier via Google AI Studio)

### Installation
       
   - Clone the repository:
        ```
            git clone https://github.com/avdhoot-hadke/Voice-Enabled-Task-Tracker.git
            cd Voice-Enabled-Task-Tracker/
        ```
   - Backend Setup:
        ```
            cd backend
            npm install
        ```
   - Frontend Setup:
        ```
            cd ../frontend
            npm install
        ```

### Environment Config
    
   - Frontend .env:
        ```
            VITE_API_BASE_URL=http://localhost:5001/
        ```
   - Backend .env:
        ```
            MONGO_URI=your_connection_string_here
            PORT=5000
            GEMINI_API_KEY=your_google_api_key_here
        ```

### Run Command
  
   - Frontend: (in the frontend terminal)
        
        ``` npm run dev ```

   - Backend: (in the backend terminal)

        ``` npm run dev ```

## Tech Stack

**Client:** React.js, Redux, TailwindCSS

**Server:** Node.js, Express

**DB:** MongoDB Atlas

**AI Provider:** Google Gemini API (Model: gemini-2.0-flash)

**Key Library:** @hello-pangea/dnd, Lucide React, Axios




## API Reference

   ### Get all tasks

```http
GET /api/tasks
```

- Request: None
- Response: 
    ```
        [
            {
                "_id": "69301c269c680762b80acb86",
                "title": "test 2",
                "description": "test 2",
                "status": "To Do",
                "priority": "Medium",
                "dueDate": "2025-12-04T00:00:00.000Z",
                "createdAt": "2025-12-03T11:16:54.495Z",
                "updatedAt": "2025-12-03T11:16:54.495Z",
                "__v": 0
            }
        ]
    ```
### Add Task

```http
POST /api/tasks
```
- Request: 
    ```
    [
        {
            "title": "Setup Backend",
            "description": "Complete phase 2 of the assignment",
            "priority": "High",
            "status": "In Progress"
        }
    ]
    ```
- Response: 
    - Success
        ```
            {
                "title": "Setup Backend",
                "description": "Complete phase 2 of the assignment",
                "status": "In Progress",
                "priority": "High",
                "_id": "693128576258ef750f4916b7",
                "createdAt": "2025-12-04T06:21:11.012Z",
                "updatedAt": "2025-12-04T06:21:11.012Z",
                "__v": 0
            }
        ```
    - Error
        ```
            {
                "message": "Title is required"
            }
        ```   
### Update task

```http
PUT /api/tasks/${id}
```
- Request:
    ```
        {
            "status": "Done"
        }
    ```
- Response: 
    - Success
    ```
        {
            "_id": "69301c139c680762b80acb82",
            "title": "Task 2",
            "description": "test ",
            "status": "Done",
            "priority": "Low",
            "dueDate": "2025-12-11T00:00:00.000Z",
            "createdAt": "2025-12-03T11:16:35.661Z",
            "updatedAt": "2025-12-04T06:23:35.729Z",
            "__v": 0
        }
    ```
    - Error
    ```
        {
            "message": "Task not found"
        }
    ```            
### Delete task

```http
DELETE /api/tasks/${id}
```
- Request: None
- Response: 
    - Success
    ```
        {
            "message": "Task deleted successfully"
        }
    ```
    - Error
    ```
        {
            "message": "Task not found"
        }
    ```

## Decisions & Assumptions

### Decisions
- AI : The Voice API does not automatically save the task. Instead, it parses the audio and opens the Task Form Modal pre-filled with data. This decision was made to allow users to verify AI accuracy and correct hallucinations before saving.

- Google Gemini: Chosen over OpenAI to avoid "Quota Exceeded" errors during the evaluation process, ensuring the demo runs smoothly on the Free Tier.


### Assumptions
 - Browser Capabilities: It is assumed the user is running the  app in Google Chrome, as window.SpeechRecognition (Web Speech API) has the best support there

## AI Tools Usage

### a. AI tools used
*   **Google Gemini:** Used for scaffolding features ( AI Integration, Drag-and-Drop Template and Redux setup) and for debugging.
*   **Google Gemini API (Integrated):** Used within the backend application logic to power the "Intelligent Parsing" feature.

### b. What they helped with
*   **Boilerplate:** Rapidly generating the initial Redux Toolkit slices and the standard boilerplate for the `@hello-pangea/dnd` integration.
*   **Debugging:** Helping to trace state management errors where the Kanban board was re-rendering unnecessarily during drag operations.

### c. Any notable prompts/approaches
*   **System Prompting:** I used a strict system prompt for the backend integration: *"You are a task parsing assistant. Convert the user's natural language message into a structured task object."*

### d. What you learned or changed because of these tools
*   **Optimistic UI:** I learned about the importance of Optimistic UI updates. Initially, the drag-and-drop felt laggy and rerendered the component two times because it waited for the server. AI helped me implement a logic where the Redux state updates immediately (`moveTaskOptimistically`), fixing the jitter and making the app feel instant.
*   **State Management Nuances:** I gained a deeper understanding of Redux state immutability and how to prevent performance issues (re-renders) when updating deeply nested arrays in the Kanban columns.
