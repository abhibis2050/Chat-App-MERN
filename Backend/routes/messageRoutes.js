const express = require("express");
const { sendMesssage, allMessages } = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");
const router=express.Router()


router.route("/").post(protect, sendMesssage);
router.route("/:chatId").get(protect, allMessages);



module.exports=router