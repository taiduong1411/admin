import mongoose from 'mongoose';
const { Schema } = mongoose;

const ConversationSchema = new Schema({
    id:{
        type: String,
        required: true,
        unique: true,
    },
    sellerId:{
        type: String,
        required: true,
    },
    buyerId:{
        type: String,
        required: true,
    },
    readBySeller:{
        type: Boolean,
        required: true,
    },
    readByBuyer:{
        type: Boolean,
        required: true,
    },
    lastMessage:{
        type: String,
        required: false,
    },
},{
    timestamps: true //để khi tạo user thì sẽ tạo và update theo tgian
});

export default mongoose.model("Conversation" , ConversationSchema)