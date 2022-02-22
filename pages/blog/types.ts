export type PostEntry = {
  date: Date,
  title: string,
  slug: string,
  body: string,
}

export type PostPageProps = {
  post: PostEntry | string,
  error: boolean,
}
