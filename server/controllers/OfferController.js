const Offer = require("../model/Offer.js");
const Product = require("../model/Product.js");
const path = require("path");
const BrandCategory = require("../model/BrandCategory.js");
const MainCategory = require("../model/MainCategory.js");
const SubCategory = require("../model/SubCategory.js");
const deleteImages = require("../utils/deleteImage.js");
const db = require("../config/db.js");
const ProductOffers = require("../model/ProductOffers.js");
const ProductImages = require("../model/ProudactImages.js");

const normalizePath = (winPath) => {
  return winPath.split(path.sep).join(path.posix.sep);
};












const getAllOffersAdmin = async (req, res) => {
  try {
    const offers = await Offer.findAll({
      include: {
        model: Product,
        through: {ProductOffers },
      },
    });

    console.log(offers)
    res.json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll();
    res.json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const createOffer = async (req, res) => {
  const {
    title,
    description,
    discountPercentage,
    discountAmount,
    startDate,
    endDate,
    productIds,
  } = req.body;

  const discountPercentageValue = discountPercentage
    ? parseFloat(discountPercentage)
    : null;
  const discountAmountValue = discountAmount
    ? parseFloat(discountAmount)
    : null;

  if (!req.file) {
    return res.status(400).json({ error: "Cover image is required" });
  }

  const imagesData = normalizePath(req.file.path);
  const relativePath = imagesData.replace("public/uploads/images/offers/", "");

  const transaction = await db.transaction();
  try {
    // Offer creation
    const offer = await Offer.create({
      title,
      description,
      discountPercentage: discountPercentageValue,
      discountAmount: discountAmountValue,
      image: relativePath,
    }, { transaction });
  
    JSON.parse(productIds).forEach( async (productId) =>  {
    
      await ProductOffers.create({
        OfferId: offer.id,
        ProductId: productId,  // Corrected the field to 'ProductId' (capitalized P)
      });
    })

 
    

    await transaction.commit();
    res.status(201).json(offer);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};


 const updateOffer = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    discountPercentage,
    discountAmount,
    startDate,
    endDate,
    productIds,
  } = req.body;
  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found." });
    }

    await offer.update({
      title,
      description,
      discountPercentage,
      discountAmount,
      startDate,
      endDate,
    });

    if (productIds && productIds.length > 0) {
      const products = await Product.findAll({
        where: {
          id: productIds,
        },
      });
      await offer.setProducts(products);
    }

    res.json(offer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

 const deleteOffer = async (req, res) => {
  const { id } = req.params;
  try {
    const offer = await Offer.findByPk(id);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found." });
    }

    if (!deleteImages("public/uploads/images/offers/", offer.image)) {
      return res.status(401).json({ message: "Problem while delete Offer" });
    }

    await offer.destroy();
    res.status(204).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

 const getOfferProducts = async (req, res) => {
  try {
    const { id } = req.query;

    const products = await Offer.findByPk(id, {
      include: [
        {
          model: Product,
          through: { attributes: [] }, // This ensures the join table (ProductOffers) is not included in the results
          include: [
            {model : ProductImages},
            { model: BrandCategory },
            { model: MainCategory },
            { model: SubCategory },
          ],
        },
      ],
    });
    

    if (!products) {
      return res.status(404).json({ error: "Offer not found." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

 const activate = async (req, res) => {
  try {
    const updateState = await Offer.update(
      {
        state: true,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (updateState) {
      res.status(200).json({ msg: "state changes successfully " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

 const deactivate = async (req, res) => {
  try {
    const updateState = await Offer.update(
      {
        state: false,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (updateState) {
      res.status(200).json({ msg: "state changes successfully " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};


module.exports = { getAllOffers, createOffer, deleteOffer,  getAllOffersAdmin , getOfferProducts ,  deactivate , updateOffer , activate };
