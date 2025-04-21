import mongoose from "mongoose";

const gratitudeEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entries: [{
    content: {
      type: String,
      required: true
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a compound index on userId and date to ensure one entry per day per user
gratitudeEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

const GratitudeEntry = mongoose.model('GratitudeEntry', gratitudeEntrySchema);

export default GratitudeEntry;