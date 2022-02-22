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
  href: string,
  title: string,
}

export const GameLink = ({ href, title }: GameLinkProps) => {
  return (
    <GameLinkContainer>
      <a href={href} title={title}>
        {title}
      </a>
    </GameLinkContainer>
  )
}
