# Contributing to PalitDaan Green

Thank you for contributing! Please follow these conventions to keep our codebase clean and traceable to our Trello board and GitHub Issues.

---

## 🌿 Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| New feature | `feature/<issue-number>-<short-name>` | `feature/12-user-login` |
| Bug fix | `fix/<issue-number>-<short-name>` | `fix/17-cart-total-bug` |
| Documentation | `docs/<short-name>` | `docs/update-readme` |
| Hotfix (urgent) | `hotfix/<short-name>` | `hotfix/broken-build` |

**Main branch (`main`)** holds stable, reviewed code only. Never push directly to `main`.

---

## ✍️ Commit Message Convention

Use the **Conventional Commits** format:

```
<type>(<scope>): <short description>

[optional body]
[optional footer: references #issue-number]
```

### Types
| Type | When to use |
|------|------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no feature/fix |
| `test` | Adding or updating tests |
| `chore` | Build tools, deps, config |

### Examples
```
feat(auth): implement user registration form
fix(cart): correct total price calculation with quantities
docs(readme): add Supabase setup instructions
chore(deps): update vite to 5.4.21
```

---

## 🔄 Pull Request Process

1. Create a branch from `main` using the naming convention above.
2. Make your changes with descriptive commits.
3. Open a Pull Request and:
   - Write a clear title and description
   - Reference the GitHub Issue: `Closes #<issue-number>`
   - Link to the Trello card in the PR description
4. Request at least **one peer reviewer** from the team.
5. The reviewer must leave a comment confirming they tested or reviewed the code.
6. Only merge after approval — do not merge your own PR.
7. Update the Trello card status to **Done** after the PR is merged.

---

## 📋 Task Card Rules (Trello/ClickUp)

- A task **cannot** move to `In Progress` without an assigned owner and written acceptance criteria.
- A task **cannot** move to `Done` without a merged PR (or documented review evidence).
- Each card must have: ID, description, assignee, reviewer, priority, deadline, estimate, checklist, acceptance criteria, and GitHub issue URL.

---

## 📁 File & Folder Conventions

- **Pages** go in `src/pages/` — one component per file, named in PascalCase.
- **CSS** goes in `src/css/` — one stylesheet per page/component.
- **Reusable components** go in `src/components/`.
- **Services / data layer** go in `src/services/`.
- **Static data** goes in `src/data/`.
- Never put business logic directly in JSX — keep it in `services/db.js`.

---

## 🔐 Security Rules

- **Never commit** real `.env` files, API keys, passwords, or secrets.
- Always use `.env.example` for sharing variable names.
- Run `git status` before every commit to confirm no `.env` is staged.
