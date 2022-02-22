import Image from 'next/image'
import styled from 'styled-components'
import { GameEntry } from '../types'

const GameImageContainer = styled.div`
  .game-screenshot-container {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr 1fr 1fr;
    grid-auto-rows: 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }

  .game-image-link {
    font-size: 0;
    border: 4px solid transparent;
  }
  .game-image-link:hover {
    border: 4px solid var(--one);
  }
  .game-image-link:hover img {
    object-fit: none;
  }

  .game-image {
    max-width: 100%;
  }
`

export const GameImages = ({ game }: GameEntry) => {
  return (
    <GameImageContainer>
      {game.images.length > 0 && (
        <>
          <h1>Screenshots</h1>
          <div className="game-screenshot-container">
            {game.images.map((image) => (
              <a key={image.url} className="game-image-link" href={image.url}>
                <Image
                  width={640}
                  height={360}
                  className="game-image"
                  src={image.url}
                  alt={`Screenshot of ${game.name}`}
                />
              </a>
            ))}
          </div>
        </>
      )}
    </GameImageContainer>
  )
}
