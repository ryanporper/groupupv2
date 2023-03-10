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
  embedLink: string;
  tagList: string[];
  likes?: {
    id: string;
    postId: string;
    userId: string;
  }[];
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
  embedLink,
  comments,
  likes,
  tagList,
  id,
}: EditProps) {
  // Toggle
  const [toggle, setToggle] = useState(false);
  const [liked, setLiked] = useState(likes?.some((like) => like.postId === id));
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

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const deletePost = () => {
    deleteToastId = toast.loading("Deleting post...", { id: deleteToastId });
    mutate(id);
  };

  return (
    <div className="bg-white my-8 p-4 rounded-lg border-4 hover:border-blue-300 hover:border-opacity-30">
      {tagList.length > 0 && (
        <div className="flex flex-wrap max-w-full gap-2 mb-2 items-center">
          <p>Tags:</p>
          {tagList?.map((tagElements) => {
            return (
              <div
                className=" bg-blue-500 text-white text-sm p-2 text-center rounded-lg"
                key={tagElements}
              >
                {capitalizeFirstLetter(tagElements)}
              </div>
            );
          })}
        </div>
      )}
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
        <p className="mt-1 mb-4 font-normal text-base">{description}</p>
        {location && (
          <iframe
            title={location}
            src={embedLink}
            width="100%"
            height="600"
            allowFullScreen
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        )}
        {media && (
          <div className="flex justify-center">
            <img src={media} alt="media" className="rounded-lg" />
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-2 cursor-pointer items-center">
        <p>
          {liked ? "??????" : "????"} {likes?.length}
        </p>
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
