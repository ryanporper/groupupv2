"use client";

import axios from "axios";
import CreatePost from "./createpost/CreatePost";
import { useQuery } from "@tanstack/react-query";
import Posts from "./components/Posts";
import { PostType } from "./types/Posts";

// get all posts
const getAllPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};

export default function Home() {
  const { data, error, isLoading } = useQuery<PostType[]>({
    queryFn: getAllPosts,
    queryKey: ["posts"],
  });
  if (error) return error;
  if (isLoading) return "Loading...";

  return (
    <main>
      {/* <CreatePost /> */}
      {data?.map((post) => (
        <Posts
          comments={post.comments}
          likes={post.likes}
          key={post.id}
          name={post.user.name}
          avatar={post.user.image}
          postTitle={post.title}
          description={post.description}
          eventDate={post.eventDate}
          price={post.price}
          location={post.location}
          media={post.media}
          embedLink={post.embedLink}
          id={post.id}
        />
      ))}
    </main>
  );
}
