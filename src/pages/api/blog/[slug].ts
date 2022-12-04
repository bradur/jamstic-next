import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  [key: string]: string | string[]
}

export default ({ query: slug }: NextApiRequest, response: NextApiResponse<Data>) => {
  response.status(200).json({ ...slug })
}
