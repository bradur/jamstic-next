import { FilterProvider } from '@lib/filterContext'
import { GamesPageProps, Jam } from 'api/jams/types'
import styled from 'styled-components'
import { GamesGrid } from './GamesGrid'

const GamesPageContainer = styled.div`
  max-width: 1080px;
  margin: auto;
  padding-bottom: 100px;

  .game-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .games-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, 256px);
    grid-auto-rows: 256px;
    grid-gap: 10px;
    justify-content: center;
  }

  @media (max-width: 1300px) {
    .games-page {
      max-width: 100%;
    }
  }
  .game-event-name,
  .game-event-result {
    display: inline-block;
    margin: auto;
    vertical-align: top;
  }
`

const findTags = (jams: Jam[]) => {
  const tags: string[] = []
  for (const jam of jams) {
    for (const entry of jam.entries) {
      for (const tag of entry.game.tags) {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      }
    }
  }
  return tags
}

export const GamesPage = ({ jams }: GamesPageProps) => {
  const entries = jams.map((jam) => jam.entries).flat()
  const tags = findTags(jams)
  return (
    <FilterProvider>
      <GamesPageContainer>
        <h1>Games</h1>
        <GamesGrid entries={entries} tags={tags}></GamesGrid>
      </GamesPageContainer>
    </FilterProvider>
  )
}
