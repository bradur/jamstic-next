import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

const GameLinkContainer = styled.div`
  a {
    width: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

type GameLinkProps = {
  href: string
  title: string
}

export const GameLink = ({ href, title }: GameLinkProps) => {
  const external = href.includes('http://') || href.includes('https://')
  return (
    <GameLinkContainer>
      <a href={href} title={title}>
        {title} {external && <FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
      </a>
    </GameLinkContainer>
  )
}
