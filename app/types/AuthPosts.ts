export type AuthPosts = {
    email: string
    id: string
    image: string
    name: string
    posts: {
      createdAt: string
      id: string
      title: string
      description: string
      eventDate: string
      price: string
      location: string
      media: string
      embedLink: string
      tagList: string[]
      likes?: {
        id: string
        postId: string
        userId: string
      }[]
      comments?: {
        createdAt: string
        id: string
        postId: string
        title: string
        userId: string
      }[]
    }[]
  }