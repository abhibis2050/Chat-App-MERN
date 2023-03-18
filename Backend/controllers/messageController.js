const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//  Create New Message

exports.sendMesssage = async (req, res) => {
  try {
    // console.log(req.user);

    const { content, chatId } = req.body;
    
    if (!content || !chatId) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid Request In Body" });
    }
    const newMessage = {
      sender: req.user.id,
      content: content,
      chat: chatId,
    };

    const message = await Message.create(newMessage);

    // message=await message.populate("sender","name pic")

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();

    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findOneAndUpdate(chatId,{latestMessage: message })

    res.send(message);

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
  
};

// Get All MEssages

exports.allMessages = async (req, res) => {
  try {
    const chatId = req.query.chatId 

    console.log( req.params.chatId);
    // console.log(req.user);
    const messages = await Message.find({ chat:chatId })   
      .populate("sender", "name pic email")
      .populate("chat");
      
    res.json(messages);

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

