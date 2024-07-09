import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

type Params = {
  id: string;
};

// GET /api/properties/id
export const GET = async (_: Request, context: { params: Params }) => {
  try {
    await connectDB();

    const propertyDocument = await Property.findById(context.params.id);

    if (!propertyDocument) {
      return new Response("Property not found", {
        status: 404,
      });
    }

    const property = propertyDocument.toObject();
    property.id = property._id.toString();

    return new Response(JSON.stringify(property), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/properties/id
export const DELETE = async (_: Request, context: { params: Params }) => {
  try {
    const propertyId = context.params.id;
    const sessionUser = await getSessionUser();

    // check for session
    if (!sessionUser?.userId) {
      return new Response("User ID is required", {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    await connectDB();

    const propertyDocument = await Property.findById(propertyId);

    if (!propertyDocument) {
      return new Response("Property not found", {
        status: 404,
      });
    }

    // verify ownership
    if (propertyDocument.owner.toString() !== userId) {
      return new Response("Unauthorised", {
        status: 401,
      });
    }

    await propertyDocument.deleteOne();

    return new Response(JSON.stringify("Property deleted"), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
