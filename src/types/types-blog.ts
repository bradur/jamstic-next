import { FoundFile } from './types-games'

export type PostEntry = {
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
  posts: FoundFile[]
  error: boolean | string
}
