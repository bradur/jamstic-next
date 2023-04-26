import { BlogDb } from 'backend/db/blogDb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostEntry } from 'types/types-blog'

type PostResponse = {
  data: PostEntry[] | string
}

export default async ({ method, body, query: slug }: NextApiRequest, response: NextApiResponse<PostResponse>) => {
  if (method === 'POST') {
    const db = await BlogDb.Initialize()
    const date = new Date(body.date)
    db.insertPost({ ...body, date })
    response.status(200).json({ data: 'success!' })
  } else if (method === 'GET') {
    const db = await BlogDb.Initialize()
    const allPosts = await db.getAllPosts()
    response.status(200).json({ data: allPosts })
  } else if (method === 'DELETE'){
    const id = parseInt(slug.slug as string, 10)
    console.log(id)
    const db = await BlogDb.Initialize()
    const resp = await db.removePost(id)
    console.log(JSON.stringify(resp))
    response.status(200).json({data: "removed"})
  }
  response.status(405)
}
