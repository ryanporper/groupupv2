"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Script from "next/script";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [media, setMedia] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  const locationInputRef = useRef(null);
  let toastPostId: string;

  useEffect(() => {
    //@ts-ignore
    if (typeof google !== "undefined") {
      //@ts-ignore
      const autocomplete = new google.maps.places.Autocomplete(
        locationInputRef.current
      );
      autocomplete.addListener("place_changed", () => {
        //@ts-ignore
        setLocation(locationInputRef.current.value);
      });
    }
  }, []);

  // create post
  const { mutate } = useMutation(
    async ({
      title,
      description,
      eventDate,
      price,
      location,
      media,
      embedLink,
    }: {
      title: string;
      description: string;
      eventDate: string;
      price: string;
      location: string;
      media: string;
      embedLink: string;
    }) =>
      await axios.post("/api/posts/createPost", {
        title,
        description,
        eventDate,
        price,
        location,
        media,
        embedLink,
      }),
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
        setEventDate("");
        setPrice("");
        setLocation("");
        setMedia("");
        setIsDisabled(false);
      },
    }
  );

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    toastPostId = toast.loading("Creating post...", { id: toastPostId });
    setIsDisabled(true);
    const embedLink = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBHw731j9k0nc6JYykkcNqPl3Layy5IGsY&q=${encodeURIComponent(
      location
    )}`;
    mutate({
      title,
      description,
      eventDate,
      price,
      location,
      media,
      embedLink,
    });
  };

  return (
    <form onSubmit={submitPost} className="bg-white p-6 rounded-md">
      <script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBHw731j9k0nc6JYykkcNqPl3Layy5IGsY&libraries=places"
        defer
      ></script>
      <div className="flex flex-col">
        <div className="flex font-bold justify-end">
          <p className="mx-1 text-red-600">* </p>
          <p> Indicates required field</p>
        </div>
        <div className="flex font-bold">
          <label>Title</label>
          <p className="mx-1 text-red-600">*</p>
        </div>
        <input
          className={`rounded-md p-1 my-1 ${
            title.length > 100 ? "bg-red-300" : "bg-gray-200"
          }`}
          placeholder="Title"
          type="text"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <div className="flex font-bold">
          <label>Date</label>
          <p className="mx-1 text-red-600">*</p>
        </div>
        <input
          className="bg-gray-200 rounded-md p-1 my-1"
          type="date"
          value={eventDate}
          required
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <label className="font-bold">Price</label>
        <input
          className="bg-gray-200 rounded-md p-1 my-1"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <label className="font-bold">Location</label>
        <input
          className="bg-gray-200 rounded-md p-1 my-1"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          ref={locationInputRef}
        />
      </div>
      <div className="flex flex-col my-4">
        <div className="flex font-bold">
          <label className="font-bold">Meida</label>
          <p className="mx-1 text-red-600">
            (Link must end in .jpg, .png, .gif, etc | Ex.
            https://i.imgur.com/xxxxxx.png)
          </p>
        </div>
        <input
          className="bg-gray-200 rounded-md p-1 my-1"
          type="text"
          value={media}
          onChange={(e) => setMedia(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4">
        <div className="flex font-bold">
          <label>Description</label>
          <p className="mx-1 text-red-600">*</p>
        </div>
        <textarea
          className={`p-4 text-lg rounded-md my-t ${
            description.length > 300 ? "bg-red-300" : "bg-gray-200"
          }`}
          name="description"
          placeholder="Describe your post"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p
          className={`font-bold text-sm ${
            description.length > 300 ? "text-red-700" : "text-gray-700"
          }`}
        >{`${description.length}/300`}</p>
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
