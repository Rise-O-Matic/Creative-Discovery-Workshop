# Local Development Guide: Creative Discovery Workshop

This guide provides step-by-step instructions to set up and run the Creative Discovery Workshop application on your local machine. By following these steps, you can work on the project independently without needing to rely on an external AI assistant for basic development tasks.

## 1. Prerequisites

Before you begin, ensure you have the following software installed on your computer:

- **Node.js**: A JavaScript runtime environment. You can download it from [https://nodejs.org/](https://nodejs.org/).
- **npm**: A package manager for Node.js, which is included with the Node.js installation.
- **Git**: A version control system for tracking changes in your code. You can download it from [https://git-scm.com/](https://git-scm.com/).

To check if you have them installed, open your terminal or command prompt and run the following commands:

```bash
node --version
npm --version
git --version
```

If these commands return version numbers, you are ready to proceed.

## 2. Project Setup

Follow these steps to get the project running on your local machine:

### Step 1: Clone the Repository

First, you need to get a copy of the project files. Open your terminal, navigate to the directory where you want to store the project, and run the following command:

```bash
git clone https://github.com/Rise-O-Matic/Creative-Discovery-Workshop.git
```

This will create a new directory named `Creative-Discovery-Workshop` containing all the project files.

### Step 2: Navigate to the Project Directory

Change your current directory to the `creative-brief-wizard` folder inside the cloned repository:

```bash
cd Creative-Discovery-Workshop/creative-brief-wizard
```

### Step 3: Install Dependencies

Next, you need to install all the necessary packages and libraries that the project depends on. Run the following command:

```bash
npm install
```

This command reads the `package.json` file and downloads all the required dependencies into a `node_modules` directory.

## 3. Running the Development Server

Once the setup is complete, you can start the local development server.

### Step 1: Start the Server

In your terminal, from the `creative-brief-wizard` directory, run the following command:

```bash
npm run dev
```

This will start the Vite development server. You should see output similar to this:

```
  VITE v7.3.0  ready in 313 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 2: Access the Application

Open your web browser and navigate to the local URL provided in the terminal output, which is typically **http://localhost:5173/**.

You should now see the Creative Discovery Workshop application running in your browser.

## 4. Making Changes

One of the benefits of using Vite is its **Hot Module Replacement (HMR)** feature. This means that when you edit and save a file (e.g., a `.tsx` or `.css` file), the changes will be reflected in the browser almost instantly, without needing to manually refresh the page.

## 5. Stopping the Server

To stop the development server, go back to your terminal where the server is running and press **`Ctrl + C`**.

## 6. Common Tasks and Troubleshooting

Here are some common situations you might encounter and how to handle them:

### Troubleshooting Common Errors

| Error Scenario | Solution |
| :--- | :--- |
| **`npm install` fails** | 1. Make sure you have a stable internet connection.<br>2. Try deleting the `node_modules` directory and the `package-lock.json` file, then run `npm install` again.<br>3. Ensure you have the correct permissions to write to the project directory. |
| **Server won't start (`npm run dev` fails)** | 1. Check the terminal for error messages. They often point to the exact file and line causing the issue.<br>2. Make sure you are in the correct directory (`creative-brief-wizard`).<br>3. Ensure that port 5173 is not already in use by another application. |
| **Blank page or application crash** | 1. Open your browser's Developer Tools (usually by pressing `F12` or `Ctrl+Shift+I`).<br>2. Look at the **Console** tab for any red error messages. These will help you identify the problem in the code.<br>3. Try refreshing the page. |
| **Changes not appearing in the browser** | 1. Make sure the development server is still running in your terminal.<br>2. Check the terminal for any compilation errors after you saved the file.<br>3. Perform a hard refresh in your browser (`Ctrl+Shift+R` or `Cmd+Shift+R`) to bypass the cache. |

### Understanding the Project Structure

Here is a brief overview of the most important directories in the `src` folder:

- `components/`: Contains reusable UI components like `StickyNote.tsx`, `Timer.tsx`, etc.
- `features/`: Contains the main application features, organized by workshop phase (e.g., `discovery`, `diverge`). Each feature folder contains the UI and logic for that part of the application.
- `contexts/`: Manages the application's global state, such as the meeting timer and session information.
- `hooks/`: Contains custom React hooks that encapsulate reusable logic (e.g., `useAutoSave.ts`).
- `services/`: Includes modules for interacting with external services, such as AI and document generation.

### Committing Your Changes with Git

After you've made changes to the code, you should save them to your Git repository. This allows you to track your work and collaborate with others.

1.  **Check the status of your changes:**

    ```bash
    git status
    ```

2.  **Add the files you want to save:**

    ```bash
    # Add all changed files
    git add .

    # Or add a specific file
    git add src/components/MyNewComponent.tsx
    ```

3.  **Commit your changes with a message:**

    ```bash
    git commit -m "Add a descriptive message about your changes"
    ```

4.  **Push your changes to GitHub:**

    ```bash
    git push origin main
    ```

By following this guide, you should be well-equipped to manage the local development of your project. Happy coding!
