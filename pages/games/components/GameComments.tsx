import Markdown from 'marked-react'
import styled from 'styled-components'
import { getMarkedRenderer } from '../../markdownRenderer'
import { GameEntry } from '../types'

const GameCommentsContainer = styled.div`
  border-top: 5px solid #eee;
  padding: 20px;
  background: #f9f9f9;

  .game-comment-body {
    padding: 10px;
    background: #fff;
    border: 1px solid #eee;
  }
  .game-comment-body p {
    margin: 0 0 5px 0;
  }

  .game-comment-body img {
    max-width: 100%;
  }
`

export const GameComments = ({ game, event }: GameEntry) => {
  const renderer = getMarkedRenderer()
  return (
    <GameCommentsContainer>
      <h2>Comments</h2>
      <div className="game-comments-container">
        {game.comments.map((comment) => (
          <div key={comment.id} className="game-comment">
            <div className="game-comment-author">{comment.author.name}</div>
            <div className="game-comment-created" title={comment.timestamp}>
              {comment.ago}
            </div>
            <div className="game-comment-body">
              <Markdown renderer={renderer} value={comment.body} />
            </div>
          </div>
        ))}
      </div>
    </GameCommentsContainer>
  )
}
