import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  [key: string]: string | string[]
}

export default ({ method, body, query: slug }: NextApiRequest, response: NextApiResponse<Data>) => {
  if (method === 'POST') {
    console.log(body)
    response.status(200).json({ data: 'success!' })
  } else if (method === 'GET') {
    //
  }
  response.status(405)
}
