import type { NextRequest } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";

// GET /api/properties/featured
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const propertiesDocuments = await Property.find({
      is_featured: true,
    });

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
