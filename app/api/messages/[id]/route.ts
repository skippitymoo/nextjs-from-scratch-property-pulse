import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

type Params = {
  id: string;
};

export const dynamic = "force-dynamic";

// PUT /api/messages/:id
export const PUT = async (_: Request, context: { params: Params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser?.userId) {
      return new Response("You must be logged in to send a message", {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    const messageDocument = await Message.findById(context.params.id);

    if (!messageDocument) {
      return new Response("Message not found", {
        status: 404,
      });
    }

    // verify ownership
    if (messageDocument.recipient.toString() !== userId) {
      return new Response("Unauthorised", { status: 401 });
    }

    // update the message to read/unread depending on the current state
    messageDocument.read = !messageDocument.read;

    await messageDocument.save();

    const msg = messageDocument.toObject();
    msg.id = msg._id.toString();

    return new Response(JSON.stringify(msg), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/messages/:id
export const DELETE = async (request: Request, context: { params: Params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser?.userId) {
      return new Response("You must be logged in", {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    const messageDocument = await Message.findById(context.params.id);

    if (!messageDocument) {
      return new Response("Message not found", {
        status: 404,
      });
    }

    // verify ownership
    if (messageDocument.recipient.toString() !== userId) {
      return new Response("Unauthorised", { status: 401 });
    }

    // delete the message
    await messageDocument.deleteOne();

    return new Response("Message deleted", {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
