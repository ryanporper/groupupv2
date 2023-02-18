"use client";

import Image from "next/image";
import { useState } from "react";
import Toggle from "./Toggle";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";

type EditProps = {
  id: string;
  avatar: string;
  name: string;
  title: string;
  description: string;
  eventDate: string;
  price: string;
  location: string;
  media: string;
  comments?: {
    id: string;
    postId: string;
    userId: string;
  }[];
};

export default function EditPost({
  avatar,
  name,
  title,
  description,
  eventDate,
  price,
  location,
  media,
  comments,
  id,
}: EditProps) {
  // Toggle
  const [toggle, setToggle] = useState(false);
  let deleteToastId: string;
  const queryClient = useQueryClient();
  // delete post
  const { mutate } = useMutation(
    async (id: string) =>
      await axios.delete("/api/posts/deletePost", { data: id }),
    {
      onError: (error) => {
        console.log(error);
        toast.error("Error deleting post", { id: deleteToastId });
      },
      onSuccess: (data) => {
        console.log(data);
        toast.success("Post removed", { id: deleteToastId });
        queryClient.invalidateQueries(["auth-posts"]);
      },
    }
  );

  const deletePost = () => {
    deleteToastId = toast.loading("Deleting post...", { id: deleteToastId });
    mutate(id);
  };

  return (
    <div className="bg-white my-8 p-8 rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            width={32}
            height={32}
            src={avatar}
            alt="avatar"
          />
          <h3 className="font-bold text-gray-700">{name}</h3>
        </div>
        <div className="flex">
          <h3 className="font-bold text-gray-700">{eventDate}</h3>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-center">
          <h1 className="my-3 font-bold text-2xl">{title}</h1>
          {price && (
            <p className="my-3 font-bold text-center text-emerald-600">
              ${price}
            </p>
          )}
        </div>
        <p className="mt-1 mb-4">{description}</p>
        {location && <p className="my-1">{location}</p>}
        {media && (
          <div className="flex justify-center">
            <img src={media} alt="media" className="rounded-lg" />
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-2 cursor-pointer items-center">
        <Link href={`/post/${id}`}>
          <p className="text-sm font-bold text-gray-700">
            {comments?.length} Comments
          </p>
        </Link>
        <button
          className="text-sm font-bold text-red-600"
          onClick={(e) => setToggle(true)}
        >
          Delete Post
        </button>
      </div>
      {toggle && <Toggle deletePost={deletePost} setToggle={setToggle} />}
    </div>
  );
}
