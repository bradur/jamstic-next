import { GamesPageProps } from 'games/types'
import styled from 'styled-components'
import { GamesPageGame } from './GamesPageGame'

const GamesPageContainer = styled.div`
  max-width: 1280px;
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
    <GamesPageContainer>
      <h1>Games</h1>

      {jams.map((jam) => (
        <div key={jam.name}>
          <h2>{jam.name}</h2>
          <div className='games-container'>
            {jam.entries.map((entry) => (
              <GamesPageGame key={entry.id} {...entry} />
            ))}
          </div>
        </div>
      ))}
    </GamesPageContainer>
  )
}
