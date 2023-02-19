"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

type Like = {
  postId?: string;
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
}: PostProps) {
  const [isLiked, setIsLiked] = useState(
    !!likes?.find((like) => like.userId === "currentUserId")
  );

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (data: Like) => {
      return axios.post("/api/posts/addLike", {
        postId: id,
        userId: "currentUserId",
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["detail-post"]);
        setIsLiked(true);
        toast.success("You liked the post!");
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
    if (!isLiked) {
      mutate({ postId: id });
    }
  };

  return (
    <div className="bg-white my-8 p-4 rounded-lg">
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
        <div className="border-slate-200 border-4 rounded-xl">
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
          {isLiked ? `Liked ❤️ ${likes?.length}` : `Like ${likes?.length}`}
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
