"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { MessageType } from "@/types/app-types";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const [isRead, setIsRead] = useState(message.read || false);
  const [isDeleted, setIsDeleted] = useState(false);

  const propertyName =
    typeof message.property === "object"
      ? message.property.name
      : message.property;
  const username =
    typeof message.sender === "object"
      ? message.sender.username
      : message.sender;

  const handleReadClick = async () => {
    try {
      const res = await fetch(`/api/messages/${message.id}`, { method: "PUT" });
      if (res.status === 200) {
        const { read } = await res.json();
        setIsRead(read);
        const notificationText = read ? "Marked as read" : "Marked as new";
        toast.success(notificationText);
      } else {
        toast.error("Error updating message");
      }
    } catch (error) {
      console.error("Error updating message", error);
      toast.error("Error updating message");
    }
  };

  const handleDeleteClick = async () => {
    try {
      const res = await fetch(`/api/messages/${message.id}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        toast.success("Message deleted");
        setIsDeleted(true);
      } else {
        toast.error("Error deleting message");
      }
    } catch (error) {
      console.error("Error deleting message", error);
      toast.error("Error deleting message");
    }
  };

  if (isDeleted) return null;

  return (
    <div
      key={message.id}
      className="relative bg-white p-4 rounded-md shadow-md border border-gray-200"
    >
      {!isRead && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md">
          New
        </div>
      )}
      <h2 className="text-xl mb-4">
        <span className="font-bold">Property Inquiry:</span> {propertyName}
      </h2>
      <p className="text-gray-700">{message.msgBody}</p>
      <ul className="mt-4">
        <li>
          <strong>Name:</strong> {username}
        </li>

        <li>
          <strong>Reply Email:</strong>{" "}
          <a href={`mailto:${message.email}`} className="text-blue-500">
            {message.email}
          </a>
        </li>
        <li>
          <strong>Reply Phone:</strong>{" "}
          <a href={`tel:${message.phone}`} className="text-blue-500">
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
      <button
        onClick={handleReadClick}
        className={`mt-4 mr-3 ${
          isRead ? "bg-gray-300" : "bg-blue-500 text-white"
        }  py-1 px-3 rounded-md`}
      >
        {isRead ? "Mark As New" : "Mark As Read"}
      </button>
      <button
        onClick={handleDeleteClick}
        className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md"
      >
        Delete
      </button>
    </div>
  );
};

export default Message;
