import mongoose from 'mongoose'

const FormSchema = new mongoose.Schema({
    Message: {
        type: String,
        required: true,
    },
    
});

const Message = mongoose.model('Message', FormSchema);
export default Message;