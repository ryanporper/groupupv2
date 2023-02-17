"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  let toastPostId: string;

  // create post
  const { mutate } = useMutation(
    async ({ title, description }: { title: string; description: string }) =>
      await axios.post("/api/posts/createPost", { title, description }),
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
        setIsDisabled(false);
      },
    }
  );

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    toastPostId = toast.loading("Creating post...", { id: toastPostId });
    setIsDisabled(true);
    mutate({ title, description });
  };

  return (
    <form onSubmit={submitPost} className="bg-white my-8 p-8 rounded-md">
      <div className="flex flex-col my-4">
        <textarea
          className="p-4 text-lg rounded-md my-t bg-gray-200"
          name="title"
          placeholder="Write something cool"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></textarea>
      </div>
      <div className="flex flex-col my-4">
        <textarea
          className="p-4 text-lg rounded-md my-t bg-gray-200"
          name="description"
          placeholder="Describe your post"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p
          className={`font-bold text-sm ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          }`}
        >{`${title.length}/300`}</p>
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
