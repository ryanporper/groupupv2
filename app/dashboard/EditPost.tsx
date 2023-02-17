"use client";

import Image from "next/image";
import { useState } from "react";
import Toggle from "./Toggle";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type EditProps = {
  id: string;
  avatar: string;
  name: string;
  title: string;
  description: string;
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
    <>
      <div className="bg-white my-8 p-8 rounded-lg">
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
        <div className="my-8">
          <p className="break-all text-gray-700 text-lg">{title}</p>
        </div>
        <div className="my-8">
          <p className="break-all text-gray-700 text-lg">{description}</p>
        </div>
        <div className="flex items-center gap-4 cursor-pointer">
          <p className="text-sm font-bold text-gray-700">
            {comments?.length} Comments
          </p>
          <button
            className="text-sm font-bold text-red-600"
            onClick={(e) => setToggle(true)}
          >
            Delete Post
          </button>
        </div>
      </div>
      {toggle && <Toggle deletePost={deletePost} setToggle={setToggle} />}
    </>
  );
}
