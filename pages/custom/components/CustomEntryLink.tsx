import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

const fontSize = 16

const CustomEntryLinkContainer = styled.div`
  a {
    width: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: ${fontSize}px;
  }

  .custom-entry-link-icon {
    width: ${fontSize}px;
    height: ${fontSize}px;
  }
`

type CustomEntryLinkProps = {
  href: string
  title: string
}

export const CustomEntryLink = ({ href, title }: CustomEntryLinkProps) => {
  const external = href.includes('http://') || href.includes('https://')
  return (
    <CustomEntryLinkContainer>
      <a href={href} title={title}>
        {title}{' '}
        {external && (
          <FontAwesomeIcon
            className='custom-entry-link-icon'
            icon={faArrowUpRightFromSquare}
            width={fontSize}
            height={fontSize}
          />
        )}
      </a>
    </CustomEntryLinkContainer>
  )
}
