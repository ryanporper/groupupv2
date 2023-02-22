"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthPosts } from "../types/AuthPosts";
import EditPost from "./EditPost";

const fetchAuthPosts = async () => {
  const response = await axios.get("/api/posts/authPosts");
  return response.data;
};

export default function UserPosts() {
  const { data, isLoading } = useQuery<AuthPosts>({
    queryFn: fetchAuthPosts,
    queryKey: ["auth-posts"],
  });
  if (isLoading) return <p>Loading posts...</p>;
  return (
    <div>
      {data?.posts?.map((post) => (
        <EditPost
          id={post.id}
          key={post.id}
          avatar={data.image}
          name={data.name}
          title={post.title}
          description={post.description}
          eventDate={post.eventDate}
          price={post.price}
          location={post.location}
          media={post.media}
          embedLink={post.embedLink}
          comments={post.comments}
          likes={post.likes}
          tagList={post.tagList}
        />
      ))}
    </div>
  );
}
