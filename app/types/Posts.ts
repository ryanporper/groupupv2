export type PostType = {
    title: string;
    description: string;
    eventDate: string;
    price: string;
    location: string;
    media: string;
    embedLink: string;
    id: string;
    createdAt: string;
    tagList: string[];
    user: {
        name: string;
        image: string;
    }
    likes?: {
        id: string;
        postId: string;
        userId: string;
    }[]
    comments?: {
        createdAt: string;
        id: string;
        postId: string;
        userId: string;
    }[]
}