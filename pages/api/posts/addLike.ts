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
      where: { email: session?.user?.email as string },
    });
    try {
      const { postId } = req.body;
      if (!postId) {
        return res.status(400).json({ message: "Please provide a post ID." });
      }
      const existingLike = await prisma.like.findUnique({
        where: { id: `${postId}_${userId?.id}` }
      });
      if (existingLike) {
        await prisma.like.delete({ where: { id: existingLike.id } });
        return res.status(200).json({ message: "Like removed." });
      } else {
        const result = await prisma.like.create({
          data: {
            postId,
            userId: userId?.id as string,
          },
        });
        return res.status(200).json(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  }
}
