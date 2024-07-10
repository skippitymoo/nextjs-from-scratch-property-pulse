import connectDB from "@/config/database";
import Property from "@/models/Property";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// GET /api/bookmarks
export const GET = async (request: Request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser?.userId) {
      return new Response("User id is required!", { status: 401 });
    }

    // Find user in database
    const { userId } = sessionUser;
    const user = await User.findOne({ id: userId });

    if (!user) {
      return new Response("User is required!", { status: 401 });
    }

    const bookmarksDocuments = await Property.find({
      _id: {
        $in: user.bookmarks,
      },
    });

    const properties = bookmarksDocuments.map((propertyDocument) => {
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

// POST /api/bookmarks
export const POST = async (request: Request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser?.userId) {
      return new Response("User id is required!", { status: 401 });
    }

    const { userId } = sessionUser;
    const { propertyId } = await request.json();

    // Find user in database
    const user = await User.findOne({ id: userId });

    if (!user) {
      return new Response("User is required!", { status: 401 });
    }

    // check if property is bookmarked
    let isBookmarked = user.bookmarks
      ?.map(String)
      .includes(propertyId.toString());

    let message;

    if (isBookmarked) {
      // if already bookmarked, then remove it
      user.bookmarks = user.bookmarks?.filter(
        (propId) => propId.toString() !== propertyId.toString()
      );
      message = "Bookmark removed successfully";
      isBookmarked = false;
    } else {
      // if not bookmarked, then add it
      user.bookmarks?.push(propertyId);
      message = "Bookmark added successfully";
      isBookmarked = true;
    }

    await user.save();

    return new Response(JSON.stringify({ message, isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
