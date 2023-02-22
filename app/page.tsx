"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Posts from "./components/Posts";
import { PostType } from "./types/Posts";
import { useState } from "react";

// get all posts
const getAllPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};

function usePostFilter() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, error, isLoading } = useQuery<PostType[]>({
    queryFn: getAllPosts,
    queryKey: ["posts"],
  });
  const filteredData = data?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { error, isLoading, filteredData, searchTerm, setSearchTerm };
}

export default function Home() {
  const { error, isLoading, filteredData, searchTerm, setSearchTerm } =
    usePostFilter();

  if (error) return error;
  if (isLoading) return "Loading...";

  return (
    <main>
      <div className="flex flex-col justify-center text-center items-center">
        <label className="p-1 font-bold text-lg ">
          Search posts by title name
        </label>
        <input
          className="rounded-lg p-1 border-2 hover:border-blue-300 outline-none w-8/12 -mb-5"
          type="text"
          placeholder="Filter posts by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredData?.map((post) => (
        <Posts
          comments={post.comments}
          likes={post.likes}
          tagList={post.tagList}
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
