const MainCategory = require('../model/MainCategory.js');
const path = require('path');
const deleteImages = require('../utils/deleteImage.js');



function normalizePath(winPath) {
  return winPath.split(path.sep).join(path.posix.sep);
}





class MainCategoryController {

  async create(req, res) {

    try {

      const imagesData = normalizePath(req.file.path).replace('public/uploads/images/mainCategorys/', '');

      const { name, description } = req.body;
      const newCategory = await MainCategory.create({ name, description  , image :imagesData });
      res.status(201).json(newCategory);
    } catch (error) {
      console.log(error);

      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const categories = await MainCategory.findAll();
      res.status(200).json(categories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await MainCategory.findByPk(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Main category not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      let imageData;
      const { id } = req.params;
      const { name } = req.body;
      const category = await MainCategory.findByPk(id);
 


      if(req.file) {
        imageData = normalizePath(req.file.path).replace('public/uploads/images/mainCategorys/', '');
        if(!deleteImages('public/uploads/images/mainCategorys/' , category.image )){
          return res.status(401).json({ message : "Problem while delete brand"})
        }
  
      }else{
        imageData = category.image
      }


 

      const [updated] = await MainCategory.update({ name, image : imageData }, {
        where: { id },
      });

      if (updated) {
        const updatedCategory = await MainCategory.findByPk(id);
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ message: 'Main category not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;


      const data = await MainCategory.findOne({
        where : {
            id : id
        }
    })

    if(!data){
        return res.status(404).json({ message: 'MainCategory not found' });
    }

    if(!deleteImages('public/uploads/images/mainCategorys/' , data.image)){
        return res.status(401).json({ message : "MainCategory while delete MainCategory"})
    }




      const deleted = await MainCategory.destroy({
        where: { id },
      });

      if (deleted) {
        res.status(200).json({ message: 'Main category deleted successfully' });
      } else {
        res.status(404).json({ message: 'Main category not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new MainCategoryController();
