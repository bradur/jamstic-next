import Markdown from 'marked-react'
import styled from 'styled-components'
import { getMarkedRenderer } from '../../lib/markdownRenderer'
import { GameEntry, GamePageProps } from '../types'
import { GameComments } from './GameComments'
import { GameContainer } from './GameContainer'
import { GameImages } from './GameImages'
import { GameMeta } from './GameMeta'
import { PageBreadcrumb } from './PageNavigation'

const PageContainer = styled.div`
  background: var(--one);
  padding-bottom: 40px;
  margin: 0;
  padding: 0;
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
  height: 200px;
  border-bottom: 5px solid #eee;
  background: linear-gradient(0deg, var(--five) 0%, var(--one) 100%);
  text-shadow: 2px 2px 0px black;
  color: #fff;
`

export const GamePage = ({ error, data }: GamePageProps) => {
  if (error) {
    return <p>{data}</p>
  }

  const entry = data as GameEntry
  const { game, event } = entry

  const renderer = getMarkedRenderer()

  return (
    <PageContainerWithCoverColors coverColors={game.coverColors.css}>
      <PageBreadcrumb route={'games'} />

      <GameContainer>
        <GameTitle>{game.name}</GameTitle>
        <div className='game-content'>
          <Markdown renderer={renderer} value={game.body} />
          <GameImages {...entry} />
        </div>
        <GameMeta {...entry} />
        <GameComments {...entry} />
      </GameContainer>
    </PageContainerWithCoverColors>
  )
}
//<pre>{JSON.stringify(data)}</pre>
