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

// PUT /api/properties/id
export const PUT = async (request: Request, context: { params: Params }) => {
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

    // fetch the current property state
    const currentyPropertyDocument = await Property.findById(propertyId);

    if (!currentyPropertyDocument) {
      return new Response("Property not found", {
        status: 404,
      });
    }

    if (currentyPropertyDocument.owner.toString() !== userId) {
      return new Response("Unauthorised", {
        status: 401,
      });
    }

    // checks done, get the form data and update
    const formData = await request.formData();

    // access all values from amenities
    const amenities = formData.getAll("amenities");
    const images = formData
      .getAll("images")
      .filter((file) => file && (file as File).name) as Blob[];

    // create propertyData object for database
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: sessionUser.userId,
      images: currentyPropertyDocument.images,
    };

    // update property in the database
    const updatedPropertyDocument = await Property.findByIdAndUpdate(
      propertyId,
      propertyData
    );

    const updatedProperty = updatedPropertyDocument?.toObject();
    if (updatedProperty) {
      updatedProperty.id = updatedProperty._id.toString();
    }

    return new Response(JSON.stringify(updatedProperty), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
