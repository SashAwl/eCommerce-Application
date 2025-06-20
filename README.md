# eCommerce-Application

[![Link](https://img.shields.io/badge/View%20Demo-Online-brightgreen?logo=netlify)](https://commercetools-gamestore.netlify.app/)

## 🎮 Description

A modern e-commerce web app where users can browse products, add them to a cart, and simulate purchases. It's built with up-to-date frontend tools and serves as a starting point for real online stores.

## Purpose

The main goal of this project is to learn and apply best practices in frontend development using modern tools. It's built to be easy to grow and update, and it helps the team practice working together while connecting the app to **CommerceTools**, a headless e-commerce platform.

## Technology stack

- React
- Typescript
- Vite
- Eslint, Prettier, husky
- Jest
- CommerceTools

## 📜 Available Scripts

The following scripts are defined in the `package.json` and can be run using `npm run <script>`:

| Script    | Description                     |
| --------- | ------------------------------- |
| `dev`     | Starts the development server.  |
| `build`   | Build for production.           |
| `preview` | Preview the production build.   |
| `lint`    | Lint the codebase.              |
| `format`  | Format all files with Prettier. |
| `prepare` | Prepares Git hooks using Husky. |
| `test`    | Run tests with Jest.            |

## 🚀 Running the Application

Follow these steps to set up and run the application:

### 1. Copy and rename the `.env-example` file

Rename the `.env-example` file to `.env` in the root of the project directory.

```bash
cp .env-example .env
```

### 2. Set environment variables with your data

### 3. Install dependencies

Rename the `.env-example` file to `.env` in the root of the project directory.

```bash
npm install
```

### 4. Run the application

To start the development server, run the following command:

```bash
npm run dev
```

## 🤝 Contributing

Contributions are welcome! To help us accept your changes quickly, please follow these simple rules:

1. Create Pull Requests: All changes must be submitted via a Pull Request from your own fork of this repository.
2. Implement your changes, keeping the coding style consistent.
4. Lint and Format: Before committing, run the linter and formatter to ensure your code adheres to the project's standards.

```bash
npm run lint
npm run format
```

5. Commit Your Changes: Commit your work with a clear and descriptive commit message.
```bash
git commit -m "feat: Add new awesome feature"
```

7. Open a Pull Request from your branch to the develop branch of the main repository. Provide a clear description of the changes you've made.

We appreciate your help in making this GameStore even better!
