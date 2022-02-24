import { DEFAULT_MARKDOWN_OPTIONS } from '@lib/constants'
import { ago, formatDate, parseDate } from '@lib/date'
import Markdown from 'marked-react'
import Image from 'next/image'
import styled from 'styled-components'
import { GameEntry, GameEntryComment } from '../types'
import { GameLink } from './GameLink'

const GameCommentsContainer = styled.div`
  border-top: 5px solid #eee;
  padding: 20px;
  background: #f9f9f9;

  .game-comment-body {
    padding: 20px;
    background: #fff;
    border: 1px solid #eee;
    margin: 0 40px 40px 110px;
    position: relative;
  }

  .game-comment-body:before {
    content: '';
    position: absolute;
    left: -22px;
    top: 12px;
    width: 0;
    height: 0;
    border: 24px solid transparent;
    border-right-color: #fff;
    border-left: 0;
    border-top: 0;
    z-index:10;
  }
  .game-comment-body:after {
    content: '';
    position: absolute;
    left: -24px;
    top: 11px;
    width: 0;
    height: 0;
    border: 26px solid transparent;
    border-right-color: #eee;
    border-left: 0;
    border-top: 0;
    z:index:5;
  }

  .game-comment-body p {
    margin: 0 0 5px 0;
  }

  .game-comment-body img {
    max-width: 100%;
  }

  .game-comment {
    position: relative;
  }

  .game-comment-author-image {
    position: absolute;
    width: 100px;
    top: 0;
  }

  .game-comment-meta {
    margin-left: 100px;
    display: flex;
  }

  .game-comment-meta div:first-child {
    margin: 0;
  }

  .game-comment-meta div {
    margin: 0 10px;
  }
`
const minDifMs = 60000 * 5
export const GameComments = ({ game, event }: GameEntry) => {
  return (
    <GameCommentsContainer>
      <h2>Comments</h2>
      <div className='game-comments-container'>
        {game.comments.map((comment) => (
          <GameComment {...comment} />
        ))}
      </div>
    </GameCommentsContainer>
  )
}

export const GameComment = (comment: GameEntryComment) => {
  const created = parseDate(comment.created)
  const createdAgo = ago(created)
  const createdFormatted = formatDate(created)
  let updateFormatted = ''
  let updatedAgo: string | boolean = false
  if (comment.updated !== undefined) {
    const updated = parseDate(comment.updated)
    updateFormatted = formatDate(updated)
    const dif = Math.abs(created.getTime() - updated.getTime())
    updatedAgo = dif > minDifMs ? ago(updated) : false
  }
  return (
    <div key={comment.id} className='game-comment'>
      <div className='game-comment-author-image'>
        {comment.author.avatarUrl && <Image width={80} height={80} src={comment.author.avatarUrl} />}
      </div>
      <div className='game-comment-meta'>
        <div className='game-comment-author'>
          <GameLink href={comment.author.url} title={comment.author.name} />
        </div>
        <div className='game-comment-created' title={createdFormatted}>
          on {createdFormatted} ({createdAgo})
        </div>
        {updatedAgo && (
          <div className='game-comment-updated' title={updateFormatted}>
            , updated on {updateFormatted} ({updatedAgo})
          </div>
        )}
      </div>
      <div className='game-comment-body'>
        <Markdown {...DEFAULT_MARKDOWN_OPTIONS} value={comment.body} />
      </div>
    </div>
  )
}
