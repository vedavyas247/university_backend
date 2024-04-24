import mongoose from 'mongoose';

const SolutionSchema = new mongoose.Schema({
  solutionText: {
    type: String,
    required: true,
  },
  solutionName: {
    type: String,
    required: true,
  },
});

const FormSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Regarding: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  solutions: [SolutionSchema],
  isResolved: {
    type: Boolean,
    default: false,
  },
});

const Query = mongoose.model('Query', FormSchema);
export default Query;
