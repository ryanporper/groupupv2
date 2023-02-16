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
    if (!session) return res.status(401).json({ message: "Please login to comment." });
    //get user
    const primsaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email as string},
    })
    // add comment
    try {
      const { title, postId } = req.body
      if (!title.length) {
        return res.status(401).json({ message: "Please add a title." });
      }
      const result = await prisma.comment.create({
        data: {
          title: title,
          userId: primsaUser?.id as string,
          postId,
        }
      })
      res.status(200).json(result);
    } catch (error) {
      res.status(403).json({ err: "Error deleting post" });
    }
  }
}
