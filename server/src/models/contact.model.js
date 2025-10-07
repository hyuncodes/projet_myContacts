import mongoose, {Schema} from "mongoose";

const contactSchema = new mongoose.Schema (
    {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        minLength: 10,
        maxLength: 20,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
        immutable: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
    },
    { collection: "contacts"}
);

export const Contact = mongoose.model("Contact", contactSchema);