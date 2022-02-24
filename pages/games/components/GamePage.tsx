import { DEFAULT_MARKDOWN_OPTIONS } from '@lib/constants'
import Markdown from 'marked-react'
import styled from 'styled-components'
import { GameEntry, GamePageProps } from '../types'
import { GameComments } from './GameComments'
import { GameContainer } from './GameContainer'
import { GameImages } from './GameImages'
import { GameMeta } from './GameMeta'
import { PageBreadcrumb } from './PageNavigation'

const PageContainer = styled.div`
  background: linear-gradient(0deg, var(--one) 0%, var(--five) 100%);
  padding-bottom: 40px;
  margin: 0;
  padding: 0;
`
const GameContentContainer = styled.div`
  position: relative;
`

const GameCoverImg = styled.div<{ imgUrl: string }>`
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  max-width: 920px;
  height: 400px;
  box-shadow: inset 0px 5px 3px 1px var(--one);
  margin-bottom:5px;
  background-image: url('${(props) => props.imgUrl}');
`

const PageContainerWithCoverColors = styled(PageContainer)<{
  coverColors: string
}>`
  ${(props) => props.coverColors}
`

const GameTitle = styled.h1`
  margin: auto;
  text-align: left;
  font-size: 50px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border: 0;
  background: linear-gradient(to top, var(--one), var(--five));
  margin-bottom: 5px;
  text-shadow: 2px 2px 0px black;
  color: #fff;
`

const GameDescription = styled.div`
  background: #fff;
  font-style: italic;
  padding: 20px;
`

export const GamePage = ({ error, data }: GamePageProps) => {
  if (error) {
    return <p>{data}</p>
  }

  const entry = data as GameEntry
  const { game, event } = entry

  return (
    <PageContainerWithCoverColors coverColors={game.coverColors.css}>
      <PageBreadcrumb route={'games'} />

      <GameContainer>
        <GameTitle>{game.name}</GameTitle>
        <GameMeta {...entry} />
        <GameCoverImg className='game-meta-cover' imgUrl={game.cover.url} />
        <GameContentContainer>
          <GameDescription>{game.description}</GameDescription>
          <div className='game-content'>
            <Markdown {...DEFAULT_MARKDOWN_OPTIONS} value={game.body} />
            <GameImages {...entry} />
          </div>
          <GameComments {...entry} />
        </GameContentContainer>
      </GameContainer>
    </PageContainerWithCoverColors>
  )
}
//<pre>{JSON.stringify(data)}</pre>
