import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { jwtDecode } from "jwt-decode";
export const createMessage = async (req, res, next) => {
   const token = req.headers['authorization'];
   const token_decode = jwtDecode(token);
   const newMessage = new Message({
      conversationId: req.body.conversationId,
      userId: token_decode.id,
      desc: req.body.desc
   })
   try {
      const savedMessage = await Message(newMessage).save()
      await Conversation.findOneAndUpdate({ id: req.body.conversationId }, {
         $set: {
            readBySeller: token_decode.isSeller,
            readByBuyer: !token_decode.isSeller,
            lastMessage: req.body.desc,
         },
      },
         { new: true }
      );

      return res.status(201).send(savedMessage);
   } catch (err) {
      next(err);
   }
}
export const getMessages = async (req, res, next) => {
   try {
      const messages = await Message.find({ conversationId: req.params.id });
      res.status(200).send(messages);
   } catch (err) {
      next(err)
   }
}