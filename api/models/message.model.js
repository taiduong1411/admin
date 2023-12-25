import mongoose from 'mongoose';
const { Schema } = mongoose;

const MessageSchema = new Schema({
    conversationId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
}, {
    timestamps: true //để khi tạo user thì sẽ tạo và update theo tgian
});

export default mongoose.model("Message", MessageSchema)