import styled from 'styled-components'
import { GameEntry } from '../types'
import { GameLink } from './GameLink'

const GameCoverImg =
  styled.div <
  { imgUrl: string } >
  `
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 200px;
  height: 200px;
  box-shadow: inset 0px 5px 3px 1px var(--one);
  border-bottom: 5px solid #eee;
  background-image: url('${(props) => props.imgUrl}');
`

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

export const GameMeta = ({ game, event }: GameEntry) => (
  <GameMetaContainer>
    <GameCoverImg className="game-meta-cover" imgUrl={game.cover} />
    <div className="game-meta">
      <div className="game-meta-section">
        <h2>Info</h2>
        <div className="game-event">
          {event.name}
          <span className="game-event-type">Type: {game.division}</span>
          <span className="game-event-theme">Theme: {event.theme}</span>
        </div>
        <div className="game-publish-date" title={event.date}>
          {event.ago}
        </div>
      </div>
      <div className="game-meta-section">
        <h2>Results</h2>
        {game.results.all.map((result) => (
          <div key={result.title} className="game-result">
            <div className="game-result-title">{result.title}</div>
            <div className="game-result-value">{result.result}</div>
          </div>
        ))}
      </div>
      <div className="game-meta-section">
        <h2>Links</h2>
        {game.links.map((link) => (
          <GameLink key={link.url} href={link.url} title={link.url} />
        ))}
      </div>
    </div>
  </GameMetaContainer>
)
