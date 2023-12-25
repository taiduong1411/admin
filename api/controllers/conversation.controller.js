import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";

export const createConversation = async (req,res,next)=>{
   const newConversation = new Conversation({
      id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
      sellerId: req.isSeller ? req.userId : req.body.to,
      buyerId: req.isSeller ? req.body.to : req.userId,
      readBySeller: req.isSeller,
      readByBuyer: !req.isSeller,
    });

   try{
      const savedConversation = await newConversation.save();
      res.status(201).send(savedConversation);
   }catch(err){
    next(err);
   }
};

export const updateConversation = async (req,res,next)=>{ //cập nhật xem đã đọc chưa
   try{
      const updatedConversation = await Conversation.findOneAndUpdate( //tìm kiếm và cập nhật một cuộc trò chuyện trong cơ sở dữ liệu. Đối số đầu tiên là điều kiện tìm kiếm, và đối số thứ hai là các thay đổi cần áp dụng.
         {id:req.params.id},{ 
            $set:{
               //readBySeller: true,
               //readByBuyer: true,
               ...(req.isSeller ? {readBySeller:true} : {readByBuyer:true}), //Điều này giúp theo dõi xem thông tin đã được đọc bởi bên bán hay bên mua trong hệ thống.
            },
         },
         {new: true} //để nhìn thấy cuộc trò chuyện mới
      );

      res.status(200).send(updatedConversation);
   }catch(err){
    next(err);
   }
};
export const getSingleConversation = async (req,res,next)=>{ //ID cụ thể từ cơ sở dữ liệu và gửi nó về cho client
   try{

      const conversation = await Conversation.findOne({id:req.params.id});
      if (!conversation) return next(createError(404, "Không tìm thấy!"));
      res.status(200).send(conversation);
   }catch(err){
    next(err);
   }
};
export const getConversations = async (req,res,next)=>{
   try{

      const conversations =await Conversation.find(
         req.isSeller ? {sellerId: req.userId} : {buyerId: req.userId}
      ).sort({updatedAt:-1});
      res.status(200).send(conversations);
   }catch(err){
    next(err);
   }
};