// controllers/ProductController.js
const BrandCategory = require('../model/BrandCategory.js');
const MainCategory = require('../model/MainCategory.js');
const Product = require('../model/Product.js');
const SubCategory = require('../model/SubCategory.js');
const path = require('path');
const fs = require('fs');
const deleteImages = require('../utils/deleteImage.js');
const WatchedProduct = require('../model/WatchedProudacts.js');
const { Op } = require('sequelize');
const Offer = require('../model/Offer.js');
const ProductImages = require('../model/ProudactImages.js')










class ProductController {
  async create(req, res) {
    try {
      const {
        TradeName,
        ScientificName,
        price,
        PackageType,
        Size,
        shortDescription,
        fullDescription,
        howUse,
        MainCategoryId,
        SubCategoryId,
        BrandCategoryId,
      } = req.body;


      if(!TradeName || !price || !PackageType || !Size || !shortDescription || !fullDescription || !howUse || !MainCategoryId || !SubCategoryId || !BrandCategoryId){
        return res.status(400).json("يرجى تعبئة الحقول  ");
      }




      // Extract relative paths of uploaded images
      const imagesData = req.files.map((file) => {
        const imgPath = normalizePath(file.path);
        const relativePath = imgPath.replace(
          "public/uploads/images/products/",
          ""
        );


        function normalizePath(winPath) {
          return winPath.split(path.sep).join(path.posix.sep);
        }
        return relativePath;
      });


        const TradeNameFind  = await Product.findOne({
          where : {
            TradeName : TradeName
          }
        })

        if(TradeNameFind) {
          return res.json(400).json("الاسم التجاري موجود في الموقع")
        }

      

      const newProduct = await Product.create({
        TradeName,
        ScientificName,
        price,
        PackageType,
        Size,
        shortDescription,
        fullDescription,
        howUse,
      
        MainCategoryId,
        SubCategoryId,
        BrandCategoryId,
      });
// Convert the imagesData to an array if it's not already
let imagesArray = Array.from(imagesData);

// Save images associated with the new product
await Promise.all(imagesArray.map(async (imageUrl) => {
    await ProductImages.create({
      ProductId: newProduct.id, // Associate the image with the new product
        imageUrl: imageUrl, // Set the image URL
    });
}));


      res.status(201).json(newProduct);
    } catch (error) {
      console.log(error);
      res.status(501).json({ error: error.message });
    }
  }
  async getAll(req, res) {
    try {
      // const page = parseInt(req.query.page) || 1;
      // const limit =  100;
      // const offset = (page - 1) * limit;

      const products = await Product.findAll({
        // limit,
        // offset,
        include: [
          {model : ProductImages},
          { model: MainCategory },
          { model: SubCategory },
          { model: BrandCategory },
        ],
      });
      
      // const totalPages = Math.ceil(products.count / limit);

      res.status(200).json({
        products: products,
     
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllToStore(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 8; // Number of products per page
      const offset = (page - 1) * limit;
      const filters = JSON.parse(req.query.filter || '{}'); // Parse filters from query
  
      const { price = 10000, mcategories = [], scategories = [], bcategories = [] } = filters;
  
      const where = {
        price: {
          [Op.lte]: price
        }
      };
  
      if (mcategories.length > 0) {
        where['MainCategoryId'] = {
          [Op.in]: mcategories
        };
      }
  
      if (scategories.length > 0) {
        where['SubCategoryId'] = {
          [Op.in]: scategories
        };
      }
  
      if (bcategories.length > 0) {
        where['BrandCategoryId'] = {
          [Op.in]: bcategories
        };
      }
  
      const products = await Product.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {model : ProductImages},

          { model: MainCategory },
          { model: SubCategory },
          { model: BrandCategory },
        ],
      });
  
      const totalPages = Math.ceil(products.count / limit);
  
      res.status(200).json({
        products: products.rows,
        totalPages,
        currentPage: page,
        totalProducts: products.count,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
  
  async getAllByBrandID(req, res) {
    try {
      const { id } = req.query;
  

      const products = await Product.findAll({
        where: {
          BrandCategoryId: id,
        },
        include: [
          { model: ProductImages },
          { model: MainCategory },
          { model: SubCategory },
          { model: BrandCategory },
        ],
      });
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async getProudactCount(req, res) {
    try {
      const { count, rows } = await Product.findAndCountAll();

      console.log(count);

      if (count < 0) {
        return res.status(401).json({ message: "Problem while get data" });
      }
      res.status(200).json(count);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


  async update(req, res) {
    try {
        const { id } = req.params;
        const {
            TradeName, ScientificName, price, PackageType, Size,
            shortDescription, fullDescription, howUse,
            MainCategoryId, SubCategoryId, BrandCategoryId,
        } = req.body;

        console.log(req.body);
        const updatedProduct = await Product.findByPk(id, {
            include: ProductImages, // Fetch product with associated images
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Handle image upload
        if (req.files && req.files.length > 0) {
            // Delete old images from DB and filesystem
            const oldImages = await ProductImages.findAll({ where: { ProductId: id } });
            for (const img of oldImages) {
                await img.destroy();
            }

            // Normalize the paths of new images and insert them
            const newImages = req.files.map((file) => {
                const imgPath = normalizePath(file.path);

                // Convert to relative path by removing the initial upload directory
                const relativePath = imgPath.replace("public/uploads/images/products/", "");

                // Store relative paths in DB
                return {
                    ProductId: id,
                    imageUrl: relativePath, // Store relative path instead of filename
                };
            });

            // Normalize file paths (function to convert Windows paths to POSIX)
            function normalizePath(winPath) {
                return winPath.split(path.sep).join(path.posix.sep);
            }

            await ProductImages.bulkCreate(newImages); // Insert new images into DB
        }

        // Update product details
        await Product.update(
            {
                TradeName, ScientificName, price, PackageType, Size,
                shortDescription, fullDescription, howUse,
                MainCategoryId, SubCategoryId, BrandCategoryId,
            },
            { where: { id } }
        );

        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}


  async delete(req, res) {
    try {
      const { id } = req.params;

      const proudact = await Product.findOne({
        where: {
          id: id,
        },
      });

      if (!proudact) {
        return res
          .status(401)
          .json({ message: "Problem while delete product" });
      }


      if(proudact.images) {
        if (!deleteImages("public/uploads/images/products/", proudact.images)) {
          return res
            .status(401)
            .json({ message: "Problem while delete product" });
        }
      }


      const deleted = await Product.destroy({ where: { id } });

      if (proudact) {
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async getLastProducts(req, res) {
    try {
      const products = await Product.findAll({
        limit: 8,
        order: [["createdAt", "DESC"]],
        include: [
          { model: MainCategory },
          { model: SubCategory },
          { model: BrandCategory },
          {model : ProductImages},

        ]
      });
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async discount(req, res) {
    try {
      const { discontValue, productID } = req.body;

      console.log(req.body);
      if (discontValue > 100 || discontValue < 0) {
        return res.status(401).json({ message: "Invalid discont value" });
      }
      const product = await Product.findByPk(productID);

      if (!product) {
        return res.status(401).json({ message: "Problem while get data" });
      }else{
        product.discountPercentage = parseInt(discontValue);
        product.save();
      }

   

      res.status(200).json({ message: "updated successfully " });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async outOfStock(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(401).json({ message: "Problem while get data" });
      }

      product.availability = false;
      product.save();

      res.status(200);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }


  async state (req, res) {
    console.log(req.body);
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(401).json({ message: "Problem while get data" });
      }

      product.availability = req.body.availability;
      product.save();

      res.status(200);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }


  async newProductWatched(req , res) {

    try {
      const {productID} = req.body;
 
      const createNewWatch = await WatchedProduct.create({
        ProductId  : productID,
        CustomerId : req.user.id,
  
      })
  
      if(createNewWatch){
        return res.status(200)
      }else{
        return res.status(400)
      }
    } catch (error) {

      console.log(error);
      res.status(501)
      
    }

  }


  async searchProduct  (req, res)  {

    try {
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: "Search term is required" });
      }
    
      const products = await Product.findAll({
        where: {
          TradeName: {
            [Op.like]: `%${name}%`, // Ensures it works as a search term
          },
        },
        include : [
          { model: MainCategory },
          { model: SubCategory },
          { model: BrandCategory },
          {model : ProductImages},
        ],
        left: 30,
      });
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while searching for products' });
    }
  };
  






















  async getAllByMainCategoryID(req, res) {

    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 8; // Number of products per page
      const offset = (page - 1) * limit;
      const filters = JSON.parse(req.query.filter || '{}'); // Parse filters from query
  
      const { price = 10000, mcategories = [], scategories = [], bcategories = [] } = filters;
  
      const where = {
        price: {
          [Op.lte]: price
        },
        MainCategoryId: req.query.id
      };



  
      if (mcategories.length > 0) {
        where['MainCategoryId'] = {
          [Op.in]: mcategories
        };
      }
  
      if (scategories.length > 0) {
        where['SubCategoryId'] = {
          [Op.in]: scategories
        };
      }
  
      if (bcategories.length > 0) {
        where['BrandCategoryId'] = {
          [Op.in]: bcategories
        };
      }
  
      const products = await Product.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {model : ProductImages},

          { model: MainCategory },
          { model: SubCategory },
          { model: BrandCategory },
        ],
      });

      console.log(products);
  
      const totalPages = Math.ceil(products.count / limit);
  
      res.status(200).json({
        products: products.rows,
        totalPages,
        currentPage: page,
        totalProducts: products.count,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }




  
//   async getAllByMainCategoryID(req, res) {
//     try {
//       const { id } = req.query;
// const products = await Product.findAll({
//   where: {
//     MainCategoryId: id,
//   },
//   include: [
//     { model: ProductImages },
//     { model: MainCategory },
//     { model: SubCategory },
//     { model: BrandCategory },
//   ],
// });

//       res.status(200).json(products);
//     } catch (error) {
//       console.log(error);
//       res.status(400).json({ error: error.message });
//     }
//   }





  async getAllByOfferID(req, res) {
    try {
      const { id } = req.query;
      const products = await Offer.findAll(
        {
          where: {
            id: id,
          },
          include: [
            {model : Product , include : [
              { model: ProductImages },
              { model: MainCategory },
              { model: SubCategory },
              { model: BrandCategory },
            ]},

          ],
        },
  
        
      );
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }



}

module.exports =  new ProductController();
