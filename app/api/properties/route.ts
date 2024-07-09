import { UploadApiResponse } from "cloudinary";
import connectDB from "@/config/database";
import cloudinary from "@/config/cloudinary";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/properties
export const GET = async (_: Request) => {
  try {
    await connectDB();

    const propertiesDocuments = await Property.find({});

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

// POST /api/properties
export const POST = async (request: Request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser?.userId) {
      return new Response("User id is required!", { status: 401 });
    }

    const formData = await request.formData();

    // access all values from amenities and images
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
      images: <string[]>[],
    };

    // upload imags(s) to Cloudinary
    const imageUploadPromises: Promise<UploadApiResponse>[] = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      // convert image data to base64
      const imageBase64 = imageData.toString("base64");

      // make request to upload to Cloudinary
      const uploader = cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: "propertypulse",
        }
      );

      imageUploadPromises.push(uploader);
    }

    const uploadedImagesResponses = await Promise.all(imageUploadPromises);
    propertyData.images = uploadedImagesResponses.map((res) => res.secure_url);

    const newProperty = new Property(propertyData);
    await newProperty.save();

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );

    // return new Response(JSON.stringify({ message: "temp*Success*temp" }), {
    //   status: 200,
    // });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
