import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import styled from 'styled-components'

const fontSize = 16

const GameLinkContainer = styled.div`
  a {
    width: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: ${fontSize}px;
  }

  .gamelink-icon {
    width: ${fontSize}px;
    height: ${fontSize}px;
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
      {external === false ? (
        <Link href={href}>
          <a rel='prefetch' title={title}>
            {title}
          </a>
        </Link>
      ) : (
        <a title={title} href={href}>
          {title}{' '}
          <FontAwesomeIcon
            className='gamelink-icon'
            icon={faArrowUpRightFromSquare}
            width={fontSize}
            height={fontSize}
          />
        </a>
      )}
    </GameLinkContainer>
  )
}

export default GameLink
