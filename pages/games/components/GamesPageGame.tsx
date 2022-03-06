import { RelativePath } from '@lib/path-helper'
import { GameEntry } from 'games/types'
import styled from 'styled-components'

const GamesPageGameContainer = styled.a<{ coverColors: string }>`
  ${(props) => props.coverColors}

  position: relative;
  border-left: 2px solid var(--two);
  border-bottom: 2px solid var(--three);
  border-right: 2px solid var(--four);
  border-top: 2px solid var(--five);
  border-radius: 5px;

  .game-meta {
    position: absolute;
    bottom: 10px;
    padding: 0 10px;
    left: 5px;
    box-sizing: border-box;
    right: 5px;
    margin: 0;
    color: #fff;
    text-shadow: 1px 1px 1px black;
    background: var(--one);
    border: 1px solid var(--two);
  }

  .game-picture-container {
    margin: 0;
    font-size: 0;
    height: 100%;
  }
  .game-meta h3 {
    margin: auto;
  }
  .game-palette {
    position: absolute;
    top: 0;
    background: #fff;
    padding: 2px;
    font-size: 0;
    display: none;
  }
  .game-palette div {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: top;
    margin: 0;
    border: 0;
    padding: 0;
  }
  .game-palette-one {
    background: var(--one);
  }
  .game-palette-two {
    background: var(--two);
  }
  .game-palette-three {
    background: var(--three);
  }
  .game-palette-four {
    background: var(--four);
  }
  .game-palette-five {
    background: var(--five);
  }
`

export const GamesPageGame = (entry: GameEntry) => {
  const { game, event } = entry
  return (
    <GamesPageGameContainer
      key={game.id}
      className='game-container'
      href={`games/${RelativePath.Entry(entry)}`}
      coverColors={game.coverColors.css}
    >
      <div className='game-meta'>
        <h3>{game.name}</h3>
        <div className='game-meta-event'>
          <div className='game-event-name'>{event.name}</div>
          {game.results.overall.result !== null && (
            <div className='game-event-result'>#{game.results.overall.result}</div>
          )}
        </div>
      </div>
      <div className='game-picture-container'>
        <img className='game-picture' src={RelativePath.Image(entry, game.cover)} alt='Cover picture of {game.name}' />
      </div>
    </GamesPageGameContainer>
  )
}
