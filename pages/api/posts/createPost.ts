// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res
        .status(401)
        .json({ message: "Please login to create a post." });
    }
    // const title: string = req.body.title;
    const { title, description, eventDate, price, location, media, embedLink } = req.body;    
    // get user
    const prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? undefined },
    });

    // check title length
    if (title.length > 100)
      return res.status(403).json({ message: "Title too long" });
    if (!title.length)
      return res.status(403).json({ message: "Title must be filled out" });
    if (!description.length)
      return res.status(403).json({ message: "Description must be filled out" });
    if (description.length > 300)
      return res.status(403).json({ message: "Description too long" });
    if (!eventDate)
      return res.status(403).json({ message: "Date must be filled out" })
    try {
      const result = await prisma.post.create({
        data: {
          title,
          description,
          //@ts-ignore
          eventDate,
          price,
          location,
          media,
          embedLink,
          userId: prismaUser?.id as string,
        },
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(403).json({ err: "Error creating post" });
    }
  }
}
