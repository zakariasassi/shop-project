const BrandCategory = require('../model/BrandCategory.js');
const FavouriteModel = require('../model/Favourite.js');
const MainCategory = require('../model/MainCategory.js');
const Product = require('../model/Product.js');
const ProductImages = require('../model/ProudactImages.js');
const SubCategory = require('../model/SubCategory.js');

class Favourite {




  async getAllUserFavourites (req , res) {
    try {
      const userId = req.user.id;
      const favourites = await FavouriteModel.findAll({
        where: { CustomerId: userId },
        include: [{ model: Product ,        include: [
          {model : ProductImages},
          { model: MainCategory },
          { model: SubCategory },
          { model: BrandCategory },
        ],}],
      });
      res.status(200).json(favourites);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
  async addToList(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user.id;
      const existingFavourite = await FavouriteModel.findOne({
        where: {
          
          CustomerId : userId, 
          ProductId:  productId 
        
        },
      });

      if (existingFavourite) {
        return res
          .status(400)
          .json({ message: "المنتج موجود في المفضلة" });
      }

      const newFavourite = await FavouriteModel.create({
        CustomerId : userId, 
        ProductId:  productId 
       });
      res.status(201).json(newFavourite);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async removeFromList(req, res) {
    try {
      const { id } = req.params;
      const existingFavourite = await FavouriteModel.findOne({
        where: { 
            id : id
        }
      });


      if (!existingFavourite) {
        return res
          .status(404)
          .json({ message: "Product not found in favourite list" });
      }

      await existingFavourite.destroy();
      res.status(200).json({ message: "تم ازالة المنتج من المفضلة" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new Favourite;
