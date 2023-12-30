import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";
import { jwtDecode } from "jwt-decode";
import Users from "../models/user.model.js";


export const createConversation = async (req, res, next) => {
   const _id = req.body.to
   const user = await Users.findOne({ _id: _id })
   const token = req.headers['authorization'];
   const token_decode = jwtDecode(token);
   // console.log(user);
   const newConversation = new Conversation({
      id: token_decode.isSeller ? token_decode.id + req.body.to : req.body.to + token_decode.id,
      sellerId: token_decode.isSeller ? token_decode.id : req.body.to,
      buyerId: token_decode.isSeller ? req.body.to : token_decode.id,
      readBySeller: token_decode.isSeller,
      readByBuyer: !token_decode.isSeller,
   });
   // console.log(newConversation);
   try {
      const savedConversation = await Conversation(newConversation).save();
      return res.status(201).json({ savedConversation });
   } catch (err) {
      next(err);
   }
};

export const updateConversation = async (req, res, next) => { //cập nhật xem đã đọc chưa
   const token = req.headers['authorization'];
   const token_decode = jwtDecode(token);
   const user = await Users.findOne({ _id: token_decode.id })
   try {
      const updatedConversation = await Conversation.findOneAndUpdate( //tìm kiếm và cập nhật một cuộc trò chuyện trong cơ sở dữ liệu. Đối số đầu tiên là điều kiện tìm kiếm, và đối số thứ hai là các thay đổi cần áp dụng.
         { id: req.params.id }, {
         $set: {
            readBySeller: true,
            readByBuyer: true,
            ...(user.isSeller ? { readBySeller: true } : { readByBuyer: true }), //Điều này giúp theo dõi xem thông tin đã được đọc bởi bên bán hay bên mua trong hệ thống.
         },
      },
         { new: true } //để nhìn thấy cuộc trò chuyện mới
      );

      return res.status(200).send(updatedConversation);
   } catch (err) {
      next(err);
   }
};
export const getSingleConversation = async (req, res, next) => { //ID cụ thể từ cơ sở dữ liệu và gửi nó về cho client
   const _id = req.params.id
   try {
      const conversation = await Conversation.findOne({ id: _id });
      if (!conversation) return res.status(404).json({ msg: "khong tim thay" });
      return res.status(200).json({ conversation });
   } catch (err) {
      next(err);
   }
};
export const getConversations = async (req, res, next) => {
   const token = req.headers['authorization'];
   const token_decode = jwtDecode(token);
   const user = await Users.findOne({ _id: token_decode.id });
   try {
      const conversations = await Conversation.find(
         user.isSeller ? { sellerId: token_decode.id } : { buyerId: token_decode.id }
      ).sort({ updatedAt: -1 });
      return res.status(200).send(conversations);
   } catch (err) {
      next(err);
   }
};