import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

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
