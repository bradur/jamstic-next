import { EntryDb } from 'backend/db/entryDB'
import type { NextApiRequest, NextApiResponse } from 'next'
import { GenericEntry } from 'types/types-custom'

type JamResponse = {
  data?: GenericEntry[] | string
}

type JamRequest = {
  entry: GenericEntry
}

export default async ({ method, body, query: slug }: NextApiRequest, response: NextApiResponse<JamResponse>) => {
  /*const jamSlug = Array.isArray(slug) && slug.length > 0 ? slug[0] : slug
  const jam = jamConfig.jams.find((jam) => jam.slug === jamSlug)
  if (!jam) {
    return response.status(400).json({ data: `Jam '${jamSlug}' not found in jamConfig.` })
  }*/
  if (method === 'POST') {
    //response.status(400).json({ data: 'No POST request defined' })
    console.log(body)

    const request = body as JamRequest

    console.log(request)

    const db = await EntryDb.Initialize()
    const insert = await db.insertEntry(request.entry)

    /*const db = await EntryDb.Initialize()
    const insert = await db.insertEntry({
      description: "Conway's Game of Life with a bit of Metaballs on the side implemented in Unity3D.",
      url: 'https://github.com/bradur/GameOfMetaballs',
      body: "# GameOfMetaballs\n\nConway's Game of Life with a bit of Metaballs on the side implemented in Unity3D.\n\n",
      date: 1643148000000,
      name: 'Game of Metaballs',
      slug: 'game-of-metaballs',
      categorySlug: 'other',
      links: [
        {
          url: 'https://bradur.github.io/GameOfMetaballs/',
          title: 'WebGL',
        },
      ],
      tags: ['game-of-life', 'metaballs', 'unity3d'],
      cover: {
        originalUrl: 'cover.gif',
        type: EntryImageType.COVER,
      },
      coverColors: {
        css: '--one: rgb(159,228,226);--two: rgb(51,108,107);--three: rgb(228,227,207);--four: rgb(104,134,124);--five: rgb(155,62,66);',
      },
    })*/
    response.status(200).json({ data: 'Success' })
  } else if (method === 'GET') {
    const db = await EntryDb.Initialize()
    const allEntries = await db.getAllEntries()
    response.status(200).json({ data: allEntries })
  }
  response.status(405)
}
