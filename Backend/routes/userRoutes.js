const express = require("express");
const { allUsers, registerUser, authUser } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const router=express.Router()


router.route("/").get(protect,allUsers);
router.route("/").post(registerUser);
router.route("/login").post(authUser);





module.exports=router