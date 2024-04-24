import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Number: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true, // Assuming email should be unique
    },
    Password: {
        type: String,
    },
});

const Student = mongoose.model('Student', FormSchema);

export default Student;
