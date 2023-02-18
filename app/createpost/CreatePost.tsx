"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [media, setMedia] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  let toastPostId: string;

  // create post
  const { mutate } = useMutation(
    async ({
      title,
      description,
      eventDate,
      price,
      location,
      media,
    }: {
      title: string;
      description: string;
      eventDate: string;
      price: string;
      location: string;
      media: string;
    }) =>
      await axios.post("/api/posts/createPost", {
        title,
        description,
        eventDate,
        price,
        location,
        media,
      }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, { id: toastPostId });
        }
        setIsDisabled(false);
      },
      onSuccess: (data) => {
        toast.success("Post created!", { id: toastPostId });
        queryClient.invalidateQueries(["posts"]);
        setTitle("");
        setDescription("");
        setEventDate("");
        setPrice("");
        setLocation("");
        setMedia("");
        setIsDisabled(false);
      },
    }
  );

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    toastPostId = toast.loading("Creating post...", { id: toastPostId });
    setIsDisabled(true);
    mutate({ title, description, eventDate, price, location, media });
  };

  return (
    <form onSubmit={submitPost} className="bg-white my-8 p-8 rounded-md">
      <div className="flex flex-col my-4">
        <label>Title</label>
        <input
          className={`rounded-md p-1 my-1 ${
            title.length > 100 ? "bg-red-300" : "bg-gray-200"
          }`}
          placeholder="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <label>Date</label>
        <input
          className="bg-gray-200 rounded-md p-1 my-1"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <label>Price</label>
        <input
          className="bg-gray-200 rounded-md p-1 my-1"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <label>Location</label>
        <input
          className="bg-gray-200 rounded-md p-1 my-1"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <label>Media</label>
        <input
          className="bg-gray-200 rounded-md p-1 my-1"
          type="text"
          value={media}
          onChange={(e) => setMedia(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <textarea
          className={`p-4 text-lg rounded-md my-t ${
            description.length > 300 ? "bg-red-300" : "bg-gray-200"
          }`}
          name="description"
          placeholder="Describe your post"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p
          className={`font-bold text-sm ${
            description.length > 300 ? "text-red-700" : "text-gray-700"
          }`}
        >{`${description.length}/300`}</p>
        <div>
          <Link href="/">
            <button
              className="text-sm bg-gray-600 text-white p-2 mx-2 rounded-xl disabled:opacity-25"
              type="submit"
            >
              Cancel
            </button>
          </Link>
          <button
            className="text-sm bg-teal-600 text-white p-2 rounded-xl disabled:opacity-25"
            disabled={isDisabled}
            type="submit"
          >
            Create post
          </button>
        </div>
      </div>
    </form>
  );
}
