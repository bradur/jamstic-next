import { FilterProvider } from '@lib/filterContext'
import { GamesPageProps } from 'api/jams/types'
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

export const GamesPage = ({ jams }: GamesPageProps) => {
  return (
    <FilterProvider>
      <GamesPageContainer>
        <h1>Game jam games</h1>
        <GamesGrid jams={jams}></GamesGrid>
      </GamesPageContainer>
    </FilterProvider>
  )
}
