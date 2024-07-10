import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

type Params = {
  id: string;
};

// GET /api/bookmarks/check/id
export const GET = async (_: Request, context: { params: Params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser?.userId) {
      return new Response("User id is required!", { status: 401 });
    }

    const { userId } = sessionUser;
    const propertyId = context.params.id;

    // Find user in database
    const user = await User.findOne({ id: userId });

    if (!user) {
      return new Response("User is required!", { status: 401 });
    }

    // check if property is bookmarked
    const isBookmarked = user.bookmarks?.map(String).includes(propertyId);

    return new Response(JSON.stringify({ isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
