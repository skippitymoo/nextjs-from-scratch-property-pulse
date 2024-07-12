import { Schema, Types, model, models } from "mongoose";
import { MessageType } from "@/types/app-types";

// 1. Create an interface representing a document in MongoDB
export interface IMessage
  extends Omit<MessageType, "sender" | "recipient" | "property"> {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  property: Types.ObjectId;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
    },
    msgBody: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const getMessageModel = () => model<IMessage>("Message", MessageSchema);

const Message = (models.Message || getMessageModel()) as ReturnType<
  typeof getMessageModel
>;

export default Message;
