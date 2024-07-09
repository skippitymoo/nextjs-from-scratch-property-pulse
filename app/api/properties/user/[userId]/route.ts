import connectDB from "@/config/database";
import Property from "@/models/Property";

interface Params {
  userId: string;
}

// GET /api/properties/user/:userId
export const GET = async (_: Request, context: { params: Params }) => {
  try {
    await connectDB();
    const userId = context.params.userId;

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const propertiesDocuments = await Property.find({ owner: userId });

    const properties = propertiesDocuments.map((propertyDocument) => {
      const property = propertyDocument.toObject();
      property.id = property._id.toString();

      return property;
    });

    return new Response(JSON.stringify(properties), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
