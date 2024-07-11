import connectDB from "@/config/database";
import Property, { type IProperty } from "@/models/Property";
import { FilterQuery } from "mongoose";

// GET /api/properties/search
export const GET = async (request: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const propertyType = searchParams.get("propertyType");

    if (!location) {
      return new Response("Keyword or Location is required", { status: 400 });
    }

    const locationPattern = new RegExp(location, "i");

    let query: FilterQuery<IProperty> = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { "location.street": locationPattern },
        { "location.city": locationPattern },
        { "location.state": locationPattern },
        { "location.zipcode": locationPattern },
      ],
    };

    // only check for Property Type if is not 'All'
    if (propertyType && propertyType.toUpperCase() !== "ALL") {
      const typePattern = new RegExp(propertyType, "i");
      query.type = typePattern;
    }

    const propertiesDocuments = await Property.find(query);

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
