const express = require("express")
const {
  accessChats,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,

} = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware")
const router=express.Router()


router.route("/").post(protect,accessChats)
router.route("/").get(protect,fetchChats)
router.route("/group").post(protect,createGroupChat);
router.route("/rename").patch(protect,renameGroup);
router.route("/groupremove").patch(protect, removeFromGroup);
router.route("/groupadd").patch(protect, addToGroup);


module.exports=router