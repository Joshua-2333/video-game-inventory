# Video Game Inventory App

A **Node.js + Express + PostgreSQL** web application for managing a video game store inventory.  
Users can view categories, browse items, and perform full **CRUD** (Create, Read, Update, Delete) operations for both categories and items.  

This project was built as part of the NodeJS course assignment.

---

## Features

- **Categories & Items**
  - View all categories on the homepage.
  - Browse items within a category.
  - Special "Games" category with **genre and platform filters**.

- **CRUD Functionality**
  - Create, Read, Update, Delete categories.
  - Create, Read, Update, Delete items.
  - Admin password required for destructive actions (edit/delete).

- **Responsive Design**
  - Fully responsive on **desktop, tablet, and mobile**.
  - Cards and grids adjust to screen sizes automatically.

- **Accessibility**
  - AA-level color contrast for readability.
  - Focus indicators on buttons, inputs, and links.
  - Forms and filters designed for screen readers and keyboard navigation.

- **Special Features**
  - “Games” category supports filtering by **genre** and **platform**.
  - “Consoles” and “Accessories” categories use the same card layout as Games.
  - Clean and modern UI with hover effects and subtle shadows.

---

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Templating Engine:** EJS
- **Styling:** CSS with responsive design and accessibility considerations
- **Environment Variables:** `.env` for database URL and admin password

---

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/YOUR_USERNAME/video-game-inventory.git
cd video-game-inventory


