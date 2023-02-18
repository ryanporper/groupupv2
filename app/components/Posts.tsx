"use client";

import Image from "next/image";
import Link from "next/link";

type PostProps = {
  avatar: string;
  name: string;
  postTitle: string;
  description: string;
  eventDate: string;
  price: string;
  location: string;
  media: string;
  id: string;
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
  id,
  comments,
}: PostProps) {
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
          <h1 className="my-3 font-bold text-2xl">{postTitle}</h1>
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
      </div>
    </div>
  );
}
