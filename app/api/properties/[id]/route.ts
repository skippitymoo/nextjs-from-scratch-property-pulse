import connectDB from "@/config/database";
import Property from "@/models/Property";

type Params = {
  id: string;
};

// GET /api/properties/id
export const GET = async (request: Request, context: { params: Params }) => {
  try {
    await connectDB();

    const properties = await Property.findById(context.params.id);

    if (!properties) {
      return new Response("Property not found", {
        status: 404,
      });
    }

    return new Response(JSON.stringify(properties), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
