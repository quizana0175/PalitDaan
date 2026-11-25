# Palit Daan

Palit Daan is a React-based canteen pre-order application. Customers can browse available food, add items to a cart, submit special instructions and allergen notes, place orders, and review their order history and profile.

Administrators can manage order statuses, add menu items, and restock inventory. The app is currently a front-end demonstration: accounts, menu inventory, cart contents, and orders are stored in the browser's local storage. There is no server-side database or production authentication.

## Features

- Customer registration and sign-in
- Food menu with stock availability
- Cart and order placement, including stock checks
- Order statuses for payment, preparation, pickup, completion, or cancellation
- Order history and profile settings
- Admin panel for order and menu inventory management
- Forest-green and sage interface theme

## Tech Stack

- React and JavaScript
- React Router
- CSS
- Node.js and npm
- Browser local storage for demo data

## Requirements

- Node.js 18 or later
- npm (included with Node.js)

## Run the Project on Windows

1. Open PowerShell or the VS Code terminal.
2. Clone the repository, or change into your existing project folder:

   ```powershell
   git clone https://github.com/quizana0175/PalitDaan.git
   cd PalitDaan
   ```

   If you already have the project in a folder whose path contains spaces, quote the path, for example:

   ```powershell
   cd "Z:\L15X11W36\DRAFTS & TEMPS\PalitDaan"
   ```

3. Install dependencies:

   ```powershell
   npm.cmd install
   ```

4. Start the development server:

   ```powershell
   npm.cmd start
   ```

5. Open [http://localhost:3000](http://localhost:3000).

Use `Ctrl+C` in the terminal to stop the server. `npm.cmd` avoids PowerShell execution-policy issues with the `npm.ps1` wrapper.

## Demo Administrator Account

On the login screen, enter:

| Field | Value |
| --- | --- |
| ID Number | `admin` |
| Password | `admin123` |

The admin account is initialized in the browser when a user signs in. After login, open **Admin Panel** in the sidebar to:

- Change an order to Pending Payment, Paid & Preparing, Being Prepared, Ready for Pickup, Completed, or Canceled.
- Restock existing menu items.
- Add menu items with a name, description, price, starting stock, and optional image URL.

These are demo credentials, not secure production credentials. Passwords and role checks are handled in client-side code and browser storage. Do not use this authentication or local storage for real customer accounts or sensitive data.

## Useful Commands

```powershell
npm.cmd start
npm.cmd test -- --watchAll=false
npm.cmd run build
```

The build command creates the production bundle in `build/`.

## Project Structure

```text
PalitDaan/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── css/
│   ├── layouts/
│   ├── pages/
│   └── utils/
│       ├── auth.js
│       └── menu.js
├── package.json
└── README.md
```

## Troubleshooting

- **`npm` is not recognized or PowerShell blocks `npm.ps1`:** install Node.js, reopen the terminal, then use `npm.cmd` commands as shown above.
- **`package.json` cannot be found:** change into the project directory before running npm.
- **A dependency is missing:** run `npm.cmd install`.
- **Port 3000 is already in use:** stop the other development server, or use the alternate port offered by the start command.

To reinstall exactly the dependencies recorded in the lockfile:

```powershell
npm.cmd ci
```

---

# 🌱 Contributing

Before making any changes, always pull the latest version of the project.

```bash
git pull origin main
```

Create a new branch for your feature or fix.

```bash
git checkout -b feature/your-feature-name
```

Make your changes and save your files.

Stage your changes.

```bash
git add .
```

Commit your changes.

```bash
git commit -m "Describe your changes"
```

Push your branch to GitHub.

```bash
git push origin feature/your-feature-name
```

Finally, create a Pull Request for review.

---

# 📌 Common Git Commands

Clone the repository.

```bash
git clone https://github.com/quizana0175/PalitDaan.git
```

Go to the project.

```bash
cd PalitDaan
```

Check the current branch.

```bash
git branch
```

Check project status.

```bash
git status
```

Pull the latest changes.

```bash
git pull origin main
```

Create a new branch.

```bash
git checkout -b feature/branch-name
```

Stage changes.

```bash
git add .
```

Commit changes.

```bash
git commit -m "Your commit message"
```

Push your branch.

```bash
git push origin feature/branch-name
```

---

# 👥 Team

Quizana, Louise Daniella V.

---

# 📄 License

This project is intended for educational and academic purposes.
