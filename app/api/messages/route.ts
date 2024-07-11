import connectDB from "@/config/database";
import Message from "@/models/Message";
import { MessageType } from "@/types/app-types";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

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
