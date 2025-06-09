# Recipe Web App (Nuxt.js Frontend)

This is the frontend of the Recipe Web App built using **Nuxt.js**. It allows users to browse, create, and manage recipes while integrating with a NestJS backend.

## 🚀 Features

- 🏠 Home Page: View featured and popular recipes.
- 🔍 Search & Filters: Search recipes by name, category.
- 📜 Recipe Details: View detailed recipe information with steps, ingredients, and reviews.
- 📝 Create & Manage Recipes: Authenticated users can add, edit, and delete their own recipes.
- ❤️ Favorites: Save recipes for easy access.
- 🛒 Shopping List: Generate a shopping list based on selected recipes.
- 📅 Meal Planner: Plan meals for the week.
- 🔑 Authentication: User registration, login, and profile management.
- 📢 Notifications: Receive updates when recipes are approved or commented on.

---

## 🏗️ Tech Stack

- **Nuxt.js 3** (Vue 3 + Vite)
- **Pinia** for state management
- **Tailwind CSS** and **Nuxt UI** for styling
- **JWT Authentication**
- **Sentry** for application monitoring

---

## 📦 Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/SethyRung/Chongkran-Frontend.git
cd Chongkran-Frontend
```

### 2️⃣ Install Dependencies

```sh
yarn install
# or
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the project root and configure it:

```env
ENV="productiion" | "dev"
NUXT_API_BASE_URL="Api Base URL"
SENTRY_AUTH_TOKEN=Your-Sentry-Auth-Token
NUXT_PUBLIC_SENTRY_DNS=Your-Sentry
```

### 4️⃣ Run the Development Server

```sh
yarn dev
# or
npm run dev
```

The app will be available at **`http://localhost:3000`**.

---

## 🔐 Authentication & Authorization

- Users must log in to create, edit, or delete their recipes.
- Admins have additional privileges to approve recipes.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🎉 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📬 Contact

For any inquiries, reach out to **rungsethyhk@gmail.com** or open an issue on GitHub.

Happy Coding! 🚀
