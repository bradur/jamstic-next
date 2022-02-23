import { ago, formatDate, parseDate } from '@lib/date'
import Markdown from 'marked-react'
import styled from 'styled-components'
import { getMarkedRenderer } from '../../lib/markdownRenderer'
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
  const minDifMs = 60000 * 5
  return (
    <GameCommentsContainer>
      <h2>Comments</h2>
      <div className='game-comments-container'>
        {game.comments.map((comment) => {
          const created = parseDate(comment.created)
          const createdAgo = ago(created)
          const createdFormatted = formatDate(created)
          let updateFormatted = ''
          let updatedAgo: string | boolean = false
          if (comment.updated !== undefined) {
            const updated = parseDate(comment.updated)
            updateFormatted = formatDate(updated)
            const dif = Math.abs(created.getTime() - updated.getTime())
            console.log(`dif: ${dif} (min ${minDifMs})`)
            updatedAgo = dif > minDifMs ? ago(updated) : false
          }
          return (
            <div key={comment.id} className='game-comment'>
              <div className='game-comment-author'>{comment.author.name}</div>
              <div className='game-comment-created' title={createdFormatted}>
                {createdAgo}
              </div>
              {updatedAgo && (
                <div className='game-comment-updated' title={updateFormatted}>
                  {updatedAgo}
                </div>
              )}
              <div className='game-comment-body'>
                <Markdown renderer={renderer} value={comment.body} />
              </div>
            </div>
          )
        })}
      </div>
    </GameCommentsContainer>
  )
}
