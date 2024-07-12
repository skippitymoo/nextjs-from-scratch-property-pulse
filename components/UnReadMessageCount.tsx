"use client";
import { useEffect, useState } from "react";
import { Session } from "next-auth";

interface UnReadMessageCountProps {
  session: Session;
}

const UnReadMessageCount = ({ session }: UnReadMessageCountProps) => {
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  useEffect(() => {
    if (!session) return;

    const getCount = async () => {
      try {
        const res = await fetch(`/api/messages/unread-count`);

        if (res.status === 200) {
          const data = await res.json();
          setUnreadMsgCount(Number(data));
        }
      } catch (error) {
        console.error("Error fetching message count", error);
      }
    };

    getCount();
  }, [session]);

  return (
    unreadMsgCount > 0 && (
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {unreadMsgCount}
      </span>
    )
  );
};

export default UnReadMessageCount;
