// controllers/BrandCategoryController.js
const BrandCategory = require("../model/BrandCategory.js");
const SubCategory = require("../model/SubCategory.js");
const path = require("path");
const deleteImages = require("../utils/deleteImage.js");

function normalizePath(winPath) {
  return winPath.split(path.sep).join(path.posix.sep);
}

class BrandCategoryController {
  async create(req, res) {
    try {
      const imagesData = normalizePath(req.file.path).replace(
        "public/uploads/images/brands/",
        ""
      );

      const { name, SubCategoryId } = req.body;
      const newCategory = await BrandCategory.create({
        name,
        SubCategoryId,
        image: imagesData,
      });
      res.status(201).json(newCategory);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const categories = await BrandCategory.findAll({
        include: [{ model: SubCategory }],
      });
      res.status(200).json(categories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await BrandCategory.findByPk(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: "Main category not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, SubCategoryId } = req.body;

      const updatedCategory = await BrandCategory.findByPk(id);

      const [updated] = await BrandCategory.update(
        { name, description, SubCategoryId },
        {
          where: { id },
        }
      );

      if (updated) {
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ message: "Brand category not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await BrandCategory.findOne({
        where: { id: id },
      });

      if (!deleteImages("public/uploads/images/brands/", category.image)) {
        return res.status(401).json({ message: "Problem while delete brand" });
      }

      const deleted = await BrandCategory.destroy({
        where: { id },
      });

      if (deleted) {
        res.status(200).json({ message: "Main category deleted successfully" });
      } else {
        res.status(404).json({ message: "Main category not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new BrandCategoryController();
