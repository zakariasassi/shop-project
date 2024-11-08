// controllers/SubCategoryController.js
const MainCategory = require('../model/MainCategory.js');
const SubCategory = require('../model/SubCategory.js');

const path = require('path');
const deleteImages = require('../utils/deleteImage.js');




function normalizePath(winPath) {
  return winPath.split(path.sep).join(path.posix.sep);
}




class SubCategoryController {
  async create(req, res) {
    try {
      const { name, MainCategoryId } = req.body;

      const imagesData = normalizePath(req.file.path).replace('public/uploads/images/subcategory/', '');




      const newCategory = await SubCategory.create({ name, MainCategoryId , image : imagesData });
      res.status(201).json(newCategory);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const categories = await SubCategory.findAll({
        include: [{ model: MainCategory }],
      });
      res.status(200).json(categories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await SubCategory.findByPk(id);
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
      let image;
      const { id } = req.params;
      const { name, MainCategoryId } = req.body;


      const category = await SubCategory.findByPk(id);
      if (req.file) {
        image = normalizePath(req.file.path).replace('public/uploads/images/subcategory/', '');
      } else {
        image = category.image;
      }


      if(!deleteImages('public/uploads/images/subcategory/' , category.image )){
        return res.status(401).json({ message : "Problem while delete brand"})
      }
 
      const [updated] = await SubCategory.update(
        { name, MainCategoryId, image },
        {
          where: { id },
        }
      );
      if (updated) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: "Main category not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;


      console.log(id);

      const category = await SubCategory.findOne({
        where : { id: id }
      });

    



      const deleted = await SubCategory.destroy({
        where: { id },
      });

      if (deleted) {
        if(!deleteImages('public/uploads/images/subcategory/' , category.image )){
          return res.status(401).json({ message : "Problem while delete SubCategory"})
        }
        res.status(200).json({ message: "SubCategory deleted successfully" });
      } else {
        res.status(404).json({ message: "SubCategory not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new SubCategoryController();
