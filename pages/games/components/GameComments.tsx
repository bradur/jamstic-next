import { DEFAULT_MARKDOWN_OPTIONS } from '@lib/constants'
import { ago, formatDate, parseDate } from '@lib/date'
import { GameImageType, makeImageUrlsLocal, RelativePath } from '@lib/path-helper'
import Markdown from 'marked-react'
import Image from 'next/image'
import styled from 'styled-components'
import { GameEntry, GameEntryComment, GameEntryUser } from '../types'
import { GameLink } from './GameLink'

const GameCommentsContainer = styled.div`
  margin-top:5px;
  padding: 20px;
  padding-top:5px;
  background: none;

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
    margin-left: 110px;
    display: flex;
    background: rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.5);
    background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0));
    padding:0 10px;
    
    color:#eee;
    margin-right:40px;
  }

  .game-comment-meta div:first-child {
    margin: 0;
  }

  .game-comment-meta div {
    margin: 0 5px;
  }

  .game-comments-container-title {

  }
`
const minDifMs = 60000 * 5

type GameCommentsProps = {
  entry: GameEntry
  users: GameEntryUser[]
}

export const GameComments = ({ entry, users }: GameCommentsProps) => {
  const { game } = entry
  return (
    <GameCommentsContainer>
      <h2 className='game-comments-container-title'>Comments</h2>
      <div className='game-comments-container'>
        {game.comments.map((comment) => {
          let foundUser = users.find((user) => user.id === comment.author)
          if (foundUser === undefined) {
            foundUser = {
              id: -1,
              url: '#',
              avatar: {
                originalUrl: '',
                pathType: GameImageType.AVATAR,
              },
              name: 'Deleted',
            }
          }
          return <GameComment key={comment.id} entry={entry} comment={comment} user={foundUser} />
        })}
      </div>
    </GameCommentsContainer>
  )
}

type GameCommentProps = {
  entry: GameEntry
  comment: GameEntryComment
  user: GameEntryUser
}

export const GameComment = ({ entry, comment, user }: GameCommentProps) => {
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

  const body = makeImageUrlsLocal(entry, comment.body, GameImageType.COMMENT)
  const avatarUrl = RelativePath.Image(entry, user.avatar)

  return (
    <div key={comment.id} className='game-comment'>
      <div className='game-comment-author-image'>{avatarUrl && <Image width={80} height={80} src={avatarUrl} />}</div>
      <div className='game-comment-meta'>
        <div className='game-comment-author'>
          <GameLink href={user.url} title={user.name} />
        </div>
        <div className='game-comment-created' title={createdFormatted}>
          on {createdFormatted} ({createdAgo}){' '}
          {updatedAgo && (
            <span className='game-comment-updated' title={`updated on ${updateFormatted} (${updatedAgo})`}>
              *
            </span>
          )}
        </div>
      </div>
      <div className='game-comment-body'>
        <Markdown {...DEFAULT_MARKDOWN_OPTIONS} value={body} />
      </div>
    </div>
  )
}
