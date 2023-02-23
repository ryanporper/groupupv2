export type PostType = {
    id: string
    title: string
    description: string
    eventDate: string
    price: string
    location: string
    media: string
    embedLink: string
    updatedAt?: string
    userId: string
    tagList: string[]
    user: {
      email: string
      id: string
      image: string
      name: string
    }
    
    likes: {
      id: string
      postId: string
      userId: string
      user: {
        email: string
        id: string
        image: string
        name: string
      }
    }[]
    comments: {
      createdAt?: string
      id: string
      postId: string
      title: string
      userId: string
      user: {
        email: string
        id: string
        image: string
        name: string
      }
    }[]
  }