import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/utils/authOptions";

type SessionUser = Required<Pick<Session, "user">> & { userId: string };

export const getSessionUser = async (): Promise<SessionUser | null> => {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user) {
      return {
        user: session.user,
        userId: session.user.id || "",
      };
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};
