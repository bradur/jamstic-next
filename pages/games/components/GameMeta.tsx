import { ago, formatDate, parseDate } from '@lib/date'
import styled from 'styled-components'
import { GameEntry, GameEntryUser } from '../types'
import { GameLink } from './GameLink'

const GameMetaContainer = styled.div`
  position: absolute;
  right: 100%;
  height: 100%;
  width: 200px;
  top: 0;
  margin-right: 5px;

  .game-meta {
    position: sticky;
    top: 0;
    padding: 10px;
    background: #f9f9f9;
  }

  .game-event span {
    display: block;
  }

  .game-meta-section {
    margin-bottom: 20px;
  }
  .game-result {
    position: relative;
    border-bottom: 1px dotted #ccc;
    background: #fff;
    padding: 2px 5px;
  }
  .game-result-value {
    position: absolute;
    right: 5px;
    z-index: 5;
    top: 0;
    height: 100%;
  }
`

type GameMetaProps = {
  entry: GameEntry
  users: GameEntryUser[]
}

export const GameMeta = ({ entry: { game, event, authors }, users }: GameMetaProps) => (
  <GameMetaContainer>
    <div className='game-meta'>
      <div className='game-meta-section'>
        <h2>Info</h2>
        <div className='game-event'>
          <GameLink key={event.url} href={event.url} title={event.name} />
          <span className='game-event-type'>Type: {game.division}</span>
          <span className='game-event-theme'>Theme: {event.theme}</span>
        </div>
        <div className='game-publish-date' title={formatDate(event.date)}>
          {ago(parseDate(event.date))}
        </div>
      </div>
      <div className='game-meta-section'>
        <h2>Author{authors.length > 1 ? 's' : ''}</h2>
        {authors.map((author) => {
          const user = users.find((user) => user.id === author)
          if (user === undefined) {
            return <div className='game-author'>Unknown</div>
          }
          return (
            <div className='game-author'>
              <GameLink key={user.url} href={user.url} title={user.name} />
            </div>
          )
        })}
      </div>
      <div className='game-meta-section'>
        <h2>Results</h2>
        {game.results.all.map((result) => (
          <div key={result.title} className='game-result'>
            <div className='game-result-title'>{result.title}</div>
            <div className='game-result-value'>{result.result}</div>
          </div>
        ))}
      </div>
      <div className='game-meta-section'>
        <h2>Links</h2>
        <GameLink key={game.url} href={game.url} title='Original entry page' />
        {game.links.map((link) => (
          <GameLink key={link.url} href={link.url} title={link.title} />
        ))}
      </div>
    </div>
  </GameMetaContainer>
)
