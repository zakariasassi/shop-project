const AddsModel = require("../model/Adds.js");
const path = require("path");
const deleteImages = require("../utils/deleteImage.js");

function normalizePath(winPath) {
  return winPath.split(path.sep).join(path.posix.sep);
}

class Adds {
  async create(req, res) {
    try {
      if (!req.file) {
        return res.status(401).json({ message: "Please enter  an image " });
      }
      const imagesData = normalizePath(req.file.path).replace(
        "public/uploads/images/adds/",
        ""
      );
      const add = await AddsModel.create({
        image: imagesData,
      });
      res.status(201).json(add);
    } catch (error) {
      console.log(error);

      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const adds = await AddsModel.findAll();
      res.status(200).json(adds);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.query;


     
      const add = await AddsModel.findOne({
        where: {
          id: id,
        },
      });

      if (!add) {
        return res.status(404).json({ message: "Add not found" });
      }

      if (!deleteImages("public/uploads/images/adds/", add.image)) {
        return res.status(401).json({ message: "Problem while delete add" });
      }

      const deleted = await AddsModel.destroy({
        where: { id },
      });
      if (deleted) {
        res.status(200).json({ message: "Add deleted successfully" });
      } else {
        res.status(404).json({ message: "Add not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new Adds();
