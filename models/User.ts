import { Schema, Types, model, models } from "mongoose";

// 1. Create an interface representing a document in MongoDB
export interface IUser {
  email: string;
  username: string;
  image?: string;
  bookmarks?: Types.ObjectId[]; // (Types.ObjectId | Record<string, unknown>)[];
}

// 2. Create a Schema corresponding to the document interface.
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      // unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    image: {
      type: String,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const getUserModel = () => model<IUser>("User", UserSchema);

const User = (models.User || getUserModel()) as ReturnType<typeof getUserModel>;

export default User;
