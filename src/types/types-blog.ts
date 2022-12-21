export type PostEntry = {
  id: number
  date: Date
  title: string
  slug: string
  body: string
}

export type PostPageProps = {
  post: PostEntry | null
  error: boolean | string
}

export type PostsPageProps = {
  posts: PostEntry[]
  error: boolean | string
}
