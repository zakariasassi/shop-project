const Customers = require('../model/Customer.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const deleteImages = require('../utils/deleteImage.js');
const { Op } = require('sequelize');

dotenv.config();

function normalizePath(winPath) {
  return winPath.split(path.sep).join(path.posix.sep);
}

class CustomerController {
  async createCustomer(req, res) {
    try {
      const { username, phone, password } = req.body;


      if (!username || !password || !phone) {
        return res
          .status(400)
          .json({ message: "الرجاء تعبْة جميع الحقول المطلوبة" });
      }
      if (username === "" || password === "" || !phone === "") {
        return res
          .status(400)
          .json({ message: "الرجاء تعبْة جميع الحقول المطلوبة" });
      }
      if (username.length < 4 || username.length > 20) {
        return res
          .status(400)
          .json({ message: "اسم المستخدم يجب أن يكون بين 4 و 20 حرفا" });
      }
      if (password.length < 8 ) {
        return res
          .status(400)
          .json({ message: "كلمة المرور يجب أن تكون اكثر من 8   " });
      }
      if (phone.length < 10 || password.length > 10) {
        return res
          .status(400)
          .json({ message: "رقم الهاتف يحب ان يكون 10ارقام" });
      }
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return res.status(400).json({
          message: "اسم المستخدم يجب أن يحتوي على حروف  والأرقام فقط",
        });
      }

      // check if user already exists

      //
      const user = await Customers.findOne({
        where: {
          [Op.or]: [{ username: username }, { phone: phone }],
        },
      });

      // You can then check if a user was found and handle accordingly
      if (user) {
        console.log("User or phone already exists in the database.");
      } else {
        console.log("Username and phone are available.");
      }

      if (user) {
        return res.send({
          message: "اسم المستخدم او رقم الهاتف موجود مسبقا",
          state: false,
        });
      }
      const userphone = await Customers.findOne({
        where: {
          phone: phone,
        },
      });
      if (userphone) {
        return res.send({
          message: " رقم الهاتف  موجود مسبقا",
          state: false,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await Customers.create({
        username: username.toLowerCase(),
        phone,
        password: hashedPassword,
      });
      res.status(201).json({
        user: newUser,
        message: "تم انشاء الحساب بنجاح ",

        state: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  async loginCustomer(req, res) {
    try {
      const { phoneNumber, password } = req.body;

      if (!phoneNumber || !password) {
        return res
          .status(400)
          .json({ message: "الرجاء تعبْة الحقول المطلوبة" });
      }
      if (phoneNumber === "" || password === "") {
        return res
          .status(400)
          .json({ message: "الرجاء تعبْة الحقول المطلوبة" });
      }

      const user = await Customers.findOne({ where: { phone: phoneNumber } });

      if (!user) {
        return res.status(401).json({ message: "المستخدم غير موجود" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "كلمة المرور غير صحيح" });
      }

      const token = jwt.sign(
        { id: user.id }, 
        process.env.TOKEN_SECRET, 
        { expiresIn: "30d" }  // Token expires after 30 days
      );
      

      const userData = {
        name: user.username,
        wallet: user.walletBalance,
        image: user.image,
        phone: user.phone,
      };
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.status(200).json({ token: token, user: userData });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const {email, fullName } = req.body;

      console.log(req.body);

      let image = null;
      const updatePayload = {


        email: email.toLowerCase(),
        fullName,
      };

      const user = await Customers.findOne({
        where: {
          id: userId,
  
        },
      });

      

      if (req.file) {
        // Delete old image
        if (user.image != null) {
          if (
            !deleteImages(
              "public/uploads/images/customers/userprofile/",
              user.image
            )
          ) {
            return res
              .status(404)
              .json({ message: "image path not found or problem in server" });
          }
        }

        image = normalizePath(req.file.path).replace(
          "public/uploads/images/customers/userprofile/",
          ""
        );
      }

      if (image) {
        updatePayload.image = image;
      }

      const [updated] = await Customers.update(updatePayload, {
        where: { id: userId },
      });

      if (!updated) {
        return res.json({ message: "مشكلة في تحديث الصورة" });
      }

      res.status(200).json({ message: "تم تحديث بياناتك" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await Customers.findByPk(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getWalletBalance(req, res) {
    try {
      const userId = req.user.id;
      const user = await Customers.findByPk(userId);
      res.status(200).json({ balance: user.walletBalance });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllCustomers(req, res) {
    try {
      const customers = await Customers.findAll();
      res.status(200).json(customers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCustomer(req, res) {
    try {
      const userId = req.params.id;
      const user = await Customers.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "مستخدم غير موجود" });
      }
      if (
        user.image != null &&
        !deleteImages(
          "public/uploads/images/customers/userprofile/",
          user.image
        )
      ) {
        return res
          .status(404)
          .json({ message: "image path not found or problem in server" });
      }

      await user.destroy();
      res.status(200).json({ message: "تم حدف المستخدم" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }

  async chargeWallet(req, res) {
    try {
      const userId = req.user.id;
      const { amount } = req.body;
      const user = await Customers.findByPk(userId);
      user.walletBalance += parseFloat(amount);
      await user.save();
      res.status(200).json({ balance: user.walletBalance });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports =  new CustomerController();
