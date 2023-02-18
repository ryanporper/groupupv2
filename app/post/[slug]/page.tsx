"use client";

import AddComment from "@/app/components/AddComment";
import Post from "@/app/components/Posts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

type URL = {
  params: {
    slug: string;
  };
};

interface Comment {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  price: string;
  location: string;
  media: string;
  user: {
    name: string;
    image: string;
  };
  createdAt: string;
}

//Fetch All posts
const fetchDetails = async (slug: string) => {
  const response = await axios.get(`/api/posts/${slug}`);
  return response.data;
};

export default function PostDetail(url: URL) {
  const { data, isLoading } = useQuery({
    queryKey: ["detail-post"],
    queryFn: () => fetchDetails(url.params.slug),
  });
  if (isLoading) return "Loading...";
  console.log(data);
  return (
    <div>
      <Post
        id={data?.id}
        name={data.user.name}
        avatar={data.user.image}
        postTitle={data.title}
        description={data.description}
        eventDate={data.eventDate}
        price={data.price}
        location={data.location}
        media={data.media}
        comments={data.comments}
      />
      <AddComment id={data?.id} />
      {data?.comments?.map((comment: Comment) => (
        <div className="my-6 bg-white p-8 rounded-md" key={comment.id}>
          <div className="flex items-center gap-2">
            <Image
              width={24}
              height={24}
              src={comment.user?.image}
              alt="avatar"
              className="rounded-full"
            />
            <h3 className="font-bold">{comment?.user?.name}</h3>
            <h2 className="text-sm">{comment.createdAt}</h2>
          </div>
          <div className="py-4">{comment.title}</div>
        </div>
      ))}
    </div>
  );
}
