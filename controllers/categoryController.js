// controllers/categoryController.js
const {
  getAllCategories,
  getCategoryById,
  getItemsByCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
} = require("../db/queries");

// Show all categories
exports.categoryList = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render("layout", {
      content: "categories/categoryList",
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500");
  }
};

// Show category detail, supports numeric IDs and virtual routes:
// /categories/games
// /categories/consoles
exports.categoryDetail = async (req, res) => {
  try {
    const param = req.params.id;
    const allCategories = await getAllCategories();

    let category = null;
    let categoryName = "";
    let items = [];

    // ---------- VIRTUAL: GAMES ----------
    if (param === "games") {
      category = allCategories.find((c) => c.name === "Games");

      if (!category) {
        return res.status(404).render("404");
      }

      items = await getItemsByCategory(category.id);
      categoryName = category.name;
    }

    // ---------- VIRTUAL: CONSOLES ----------
    else if (param === "consoles") {
      category = allCategories.find((c) => c.name === "Consoles");

      if (!category) {
        return res.status(404).render("404");
      }

      items = await getItemsByCategory(category.id);
      categoryName = category.name;
    }

    // ---------- NORMAL NUMERIC CATEGORY ----------
    else {
      const numericId = Number(param);

      if (Number.isNaN(numericId)) {
        return res.status(404).render("404");
      }

      category = await getCategoryById(numericId);

      if (!category) {
        return res.status(404).render("404");
      }

      items = await getItemsByCategory(numericId);
      categoryName = category.name;
    }

    return res.render("layout", {
      content: "categories/categoryDetail",
      category,
      categoryName,
      items,
    });
  } catch (err) {
    console.error("Category detail error:", err);
    return res.status(500).render("500");
  }
};

// Create form
exports.categoryCreateForm = (req, res) => {
  res.render("layout", {
    content: "categories/categoryForm",
    category: null,
  });
};

// Create
exports.categoryCreate = async (req, res) => {
  try {
    const { name, description } = req.body;

    await insertCategory(name, description);

    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    res.status(500).render("500");
  }
};

// Edit form
exports.categoryEditForm = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).render("404");
    }

    return res.render("layout", {
      content: "categories/categoryForm",
      category,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("500");
  }
};

// Update
exports.categoryUpdate = async (req, res) => {
  try {
    const { name, description } = req.body;

    await updateCategory(req.params.id, name, description);

    res.redirect(`/categories/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render("500");
  }
};

// Delete
exports.categoryDelete = async (req, res) => {
  try {
    const items = await getItemsByCategory(req.params.id);

    if (items.length > 0) {
      return res.status(400).render("500", {
        message: "Category has items",
      });
    }

    await deleteCategory(req.params.id);

    return res.redirect("/categories");
  } catch (err) {
    console.error(err);
    return res.status(500).render("500");
  }
};