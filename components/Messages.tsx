"use client";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { MessageType } from "@/types/app-types";

const Messages = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(`/api/messages`);

        if (res.status === 200) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages", error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, []);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="bg-blue-50">
      <div className="container m-auto py-24 max-w-6xl">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">Your Messages</h1>
          <div className="space-y-4">
            {!messages?.length ? (
              <p>You have no messages</p>
            ) : (
              messages.map((message) => {
                const propertyName =
                  typeof message.property === "object"
                    ? message.property.name
                    : message.property;
                const username =
                  typeof message.sender === "object"
                    ? message.sender.username
                    : message.sender;
                return (
                  <div
                    key={message.id}
                    className="relative bg-white p-4 rounded-md shadow-md border border-gray-200"
                  >
                    <h2 className="text-xl mb-4">
                      <span className="font-bold">Property Inquiry:</span>{" "}
                      {propertyName}
                    </h2>
                    <p className="text-gray-700">{message.msgBody}</p>
                    <ul className="mt-4">
                      <li>
                        <strong>Name:</strong> {username}
                      </li>

                      <li>
                        <strong>Reply Email:</strong>{" "}
                        <a
                          href={`mailto:${message.email}`}
                          className="text-blue-500"
                        >
                          {message.email}
                        </a>
                      </li>
                      <li>
                        <strong>Reply Phone:</strong>{" "}
                        <a
                          href={`tel:${message.phone}`}
                          className="text-blue-500"
                        >
                          {message.phone}
                        </a>
                      </li>
                      <li>
                        <strong>Received:</strong>{" "}
                        {message.createdAt
                          ? new Date(message.createdAt).toLocaleString()
                          : message.createdAt}
                      </li>
                    </ul>
                    {!message.read && (
                      <button className="mt-4 mr-3 bg-blue-500 text-white py-1 px-3 rounded-md">
                        Mark As Read
                      </button>
                    )}
                    <button className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md">
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Messages;
