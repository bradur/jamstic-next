import { DBConnector } from '@backendlib/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostEntry } from 'types/types-blog'

type PostResponse = {
  data: PostEntry[] | string
}

export default async ({ method, body, query: slug }: NextApiRequest, response: NextApiResponse<PostResponse>) => {
  if (method === 'POST') {
    const db = await DBConnector.Initialize()
    const date = new Date(body.date)
    db.insertPost({ ...body, date })
    response.status(200).json({ data: 'success!' })
  } else if (method === 'GET') {
    const db = await DBConnector.Initialize()
    const allPosts = await db.getAllPosts()
    response.status(200).json({ data: allPosts })
  }
  response.status(405)
}
