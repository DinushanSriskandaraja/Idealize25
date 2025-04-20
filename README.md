# 🚀 Project Name

A brief description of the project goes here.  
Explain the problem you're solving and what your project aims to achieve.

---

## 🧱 Tech Stack

> To be finalized — here’s the placeholder.

- Frontend: (e.g., React / Vue / HTML + CSS + JS)
- Backend: (e.g., Node.js / Django / Flask)
- Database: (e.g., MongoDB / MySQL / Firebase)
- Tools: Git, GitHub, [Other tools you're using]

---

## 🌱 Git Branch Strategy

We are following a 3-branch strategy to ensure clean and stable development:

- **`main`** – Final production-ready code. Only the repo owner (Dinushan) merges here after testing is complete.
- **`test`** – Pre-release testing branch. Used to verify completed features.
- **`dev`** – Default development branch. All team members commit and push here by default.

### 🧪 Detailed Workflow:

1. The **default working branch is `dev`** – all team members commit and push their work directly to `dev`.
2. If any part of the work is **incomplete, experimental, or contains issues**, create a **separate branch** from `dev` (e.g., `pending/feature-name` or `bugfix/issue-name`) and push changes there until it’s ready.
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b pending/your-task-name
   ```
3. Once the task in a separate branch is complete, merge it back into `dev`.
4. After all active work in `dev` is finished and stable, it will be **moved to `test`** for verification.
5. Once testing is successful, only **Dinushan (repo owner)** will merge `test` into `main`.

---

## 🤝 Contribution Guidelines

### 📌 Step 1: Fork & Clone the Repository
```bash
git clone https://github.com/your-username/project-name.git
cd project-name
```

### 📌 Step 2: Checkout `dev` (Default Branch)
```bash
git checkout dev
git pull origin dev
```

- Make commits directly to `dev` if your work is complete and stable.
- If the work is not finished or experimental:
```bash
git checkout -b pending/your-feature-name
```

### 📌 Step 3: Add, Commit, Push
```bash
git add .
git commit -m "Added: your message here"
git push origin dev  # or push to your custom branch
```

### 📌 Step 4: (Optional) Create Pull Request to Merge Feature Branch into `dev`

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/DinushanSriskandaraja">
        <img src="https://github.com/DinushanSriskandaraja.png" width="100px;" alt="Dinushan"/>
        <br /><sub><b>Dinushan Sriskandaraja</b></sub>
      </a>
      <br />Team Lead / Repo Owner
    </td>
    <td align="center">
      <a href="https://github.com/Ken7373">
        <img src="https://github.com/Ken7373.png" width="100px;" alt="Ken7373"/>
        <br /><sub><b>Kenisan Sanmugathasan</b></sub>
      </a>
      <br />UI / UX Developer
    </td>
    <td align="center">
      <a href="https://github.com/aathvikguru">
        <img src="https://github.com/aathvikguru.png" width="100px;" alt="aathvikguru"/>
        <br /><sub><b>Gurudesh Prakash</b></sub>
      </a>
      <br />Backend Developer
    </td>
    <td align="center">
      <a href="https://github.com/THIGSHICCA">
        <img src="https://github.com/THIGSHICCA.png" width="100px;" alt="THIGSHICCA"/>
        <br /><sub><b>Thigshicca Vigneswaramoorthy</b></sub>
      </a>
      <br />Database & Integration Specialist
    </td>
  </tr>
</table>
