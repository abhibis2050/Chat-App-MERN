const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Create or fetch One to One Chat
exports.accessChats = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "User Id Not Found" });
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user.id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user.id, userId],
      };
      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(FullChat);
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// fetch all the chats for an user
exports.fetchChats = async (req, res) => {
  try {
    console.log(req.user);

    const results = Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
       return res.status(200).send(results);
      });
    
 

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// Create New Group Chat

exports.createGroupChat = async (req, res) => {
  try {
    const { users, name } = req.body;
    usersArr=JSON.parse(users)
    console.log(req.body);

    if (!usersArr || !req.body.name) {
      return res.status(400).send({ message: "please fill all the fields" });
    }
    console.log(req.user);

    if (usersArr.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
    // console.log(req.user);


    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: usersArr,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });
console.log(groupChat);
    const fullGroupChat = await Chat.findOneAndUpdate({ _id: groupChat._id },{$push:{users:req.user.id}})
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullGroupChat);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


//   Rename Group
exports.renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;


    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404).send({ status: false, message: "Chat Not Found" });
    } else {
      res.send(updatedChat);
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// Remove user from Group
exports.removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const removed = await Chat.findOneAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404).send({ status: false, message: "Chat Not Found" });
    } else {
      res.send(removed);
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// Add user to Group / Leave
exports.addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    
    console.log(req.body);
    
    console.log(req.user);

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404).send({ status: false, message: "Chat Not Found" });
    } else {
      res.send(added);
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


