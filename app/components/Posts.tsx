"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

type Like = {
  postId?: string;
  userId?: string;
};

type PostProps = {
  avatar: string;
  name: string;
  postTitle: string;
  description: string;
  eventDate: string;
  price: string;
  location: string;
  media: string;
  embedLink: string;
  id: string;
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

export default function Post({
  avatar,
  name,
  postTitle,
  description,
  eventDate,
  price,
  location,
  media,
  embedLink,
  id,
  comments,
  likes,
  tagList,
}: PostProps) {
  // need to update this to use userId so it only shows liked if the user liked it not just if it is liked in general
  // like count is accurate though
  const [liked, setLiked] = useState(likes?.some((like) => like.postId === id));
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (data: Like) => {
      return axios.post("/api/posts/addLike", {
        postId: id,
        userId: "currentUserId",
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["posts"]);
      },
      onError: (error) => {
        console.log(error);
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message);
        }
      },
    }
  );

  const handleLike = () => {
    mutate({ postId: id });
    setLiked(!liked);
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // add ... button to top of post that will drop down to show edit/delte
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
      <div className="bg-slate-100 p-3 rounded-lg">
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
        <div className="flex justify-between text-center">
          <h1 className="my-3 font-bold text-2xl">{postTitle}</h1>
          {price && (
            <p className="my-3 font-bold text-2xl text-emerald-600">${price}</p>
          )}
        </div>
      </div>
      <p className="my-3 px-2">{description}</p>
      {location && (
        <div className="border-slate-200 border-4 border-opacity-30 rounded-xl">
          <iframe
            title={location}
            src={embedLink}
            width="100%"
            height="600"
            allowFullScreen
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      )}
      {media && (
        <div className="flex justify-center">
          <img src={media} alt="media" className="rounded-lg" />
        </div>
      )}
      <div className="flex gap-4 mt-2 items-center">
        <p className="cursor-pointer" onClick={handleLike}>
          {liked ? "❤️" : "🤍"} {likes?.length}
        </p>
        <Link href={`/post/${id}`}>
          <p className="text-sm font-bold text-gray-700 cursor-pointer">
            {comments?.length} Comments
          </p>
        </Link>
      </div>
    </div>
  );
}
