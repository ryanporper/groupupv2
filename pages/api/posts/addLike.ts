import { NextApiRequest, NextApiResponse } from "next";
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
      return res.status(401).json({ message: "Please login to like." });
    }
    const userId = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    const like = await prisma.like.findFirst({
      where: {
        postId: req.body.postId,
        userId: userId?.id,
      },
    })
    try {
      if (!like) {
        const result = await prisma.like.create({
          data: {
            postId: req.body.postId,
            userId: userId?.id as string,
          },
        })
        res.status(201).json(result)
      } else {
        const result = await prisma.like.delete({
          where: {
            id: like.id,
          },
        })
        res.status(200).json(result)
      }
    } catch (err) {
      res.status(403).json({ err: "Error has occured while liking a post" })
    }
  }
}
