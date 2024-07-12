import connectDB from "@/config/database";
import Message from "@/models/Message";
import { MessageType } from "@/types/app-types";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// GET /api/messages
export const GET = async (_: Request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser?.userId) {
      return new Response("User ID is required", {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    const readMessageDocuments = await Message.find({
      recipient: userId,
      read: true,
    })
      .sort({ createdAt: -1 }) // sort read messages in asc order
      .populate("sender", "username")
      .populate("property", "name");

    const unreadMessageDocuments = await Message.find({
      recipient: userId,
      read: false,
    })
      .sort({ createdAt: -1 }) // sort read messages in asc order
      .populate("sender", "username")
      .populate("property", "name");

    const messageDocuments = [
      ...unreadMessageDocuments,
      ...readMessageDocuments,
    ];

    const messages = messageDocuments.map((messageDocument) => {
      const msg = messageDocument.toObject();
      msg.id = msg._id.toString();

      return msg;
    });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/messages
export const POST = async (request: Request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser?.userId) {
      return new Response("You must be logged in to send a message", {
        status: 401,
      });
    }

    const { user } = sessionUser;
    const { ...sentMessage }: MessageType = await request.json();

    // Cannot send message to self
    if (user.id === sentMessage.recipient) {
      return new Response(
        JSON.stringify({ message: "Cannot send a message to yourself" }),
        { status: 400 }
      );
    }

    const newMessage = new Message({
      ...sentMessage,
      sender: user.id,
    });

    await newMessage.save();

    return new Response(JSON.stringify({ message: "Message sent" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
