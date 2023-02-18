export type PostType = {
    title: string;
    description: string;
    eventDate: string;
    price: string;
    location: string;
    media: string;
    id: string;
    createdAt: string;
    user: {
        name: string;
        image: string;
    }
    comments?: {
        createdAt: string;
        id: string;
        postId: string;
        userId: string;
    }[]
}