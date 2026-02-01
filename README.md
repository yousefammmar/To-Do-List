# To-Do & Notes Manager

A simple, effective, and free client-side application to help you organize your life by managing tasks and notes in one place. The application uses browser `localStorage` to persist user data, providing a seamless experience without the need for a backend server.

## Key Features

*   **User Authentication**: Secure registration and login system that stores user data locally.
*   **Task Management**: Create, edit, and delete tasks. Track task status from 'Pending' to 'In Progress' to 'Completed'.
*   **Notes Manager**: Quickly add and delete short notes.
*   **Task History**: View a history of all completed tasks.
*   **User Profiles**: Update your name, password, and profile picture.
*   **Persistent Storage**: All user data, tasks, and notes are saved in the browser's `localStorage`.
*   **Responsive Design**: A clean and user-friendly interface that works on both desktop and mobile devices.

## Pages

-   **`index.html`**: The main landing page introducing the application and providing links to log in or register.
-   **`dashboard.html`**: The central hub for authenticated users to manage their active tasks and notes.
-   **`task_history.html`**: Displays a list of all tasks that have been marked as completed.
-   **`profile.html`**: Allows users to update their personal information, password, and profile picture.
-   **`login.html` / `register.html`**: Forms for user authentication and account creation.
-   **`about.html`**: Information about the development team behind the project.

## Technology Stack

*   **Frontend**: HTML5, CSS3, JavaScript (ES6)
*   **Data Persistence**: Browser `localStorage`

## Project Structure

The project is organized into clear directories for styles, scripts, and images.

```
/
├── index.html, dashboard.html, ... (HTML pages)
├── css/
│   └── style.css (Main stylesheet)
├── js/
│   ├── app.js       (Handles dashboard logic for tasks and notes)
│   ├── auth.js      (Manages user login, registration, and session control)
│   └── storage.js   (A data manager for all localStorage interactions)
└── images/
    └── (Contains images used in the UI)
```

## Getting Started

No installation or build process is required. Simply clone the repository and open the `index.html` file in your web browser.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yousefammmar/to-do-list.git
    ```
2.  **Navigate to the directory:**
    ```bash
    cd to-do-list
    ```
3.  **Open `index.html`:**
    Open the `index.html` file in your favorite web browser to start using the application.

## Meet the Team

*   **Tasneem Ahmad**: Handled the JavaScript functionality, focusing on interactivity and user experience.
*   **Yousef Odeh**: Managed the database design and authentication functionality, focusing on data management and security.
*   **Fatema Alahmad**: Developed the HTML and CSS, focusing on page structure, layout, and responsive design.
*   **Ameen Alrawabdeh**: Contributed to the server-side logic and backend functionality concepts.
