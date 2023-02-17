"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";

type User = {
  image: string;
};

export default function Logged({ image }: User) {
  return (
    <li className="flex gap-8 items-center">
      <Link href={"/createpost"}>
        <button className="text-sm bg-emerald-700 text-white py-2 px-6 rounded-md">
          Create a Post
        </button>
      </Link>
      <button
        className="text-sm bg-gray-700 text-white py-2 px-6 rounded-md"
        onClick={() => signOut()}
      >
        Logout
      </button>
      <Link href={"/dashboard"}>
        <Image
          width={64}
          height={64}
          className="w-14 rounded-full"
          src={image}
          alt=""
          priority
        ></Image>
      </Link>
    </li>
  );
}
