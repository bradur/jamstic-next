import { DEFAULT_MARKDOWN_OPTIONS } from '@lib/constants'
import Markdown from 'marked-react'
import styled from 'styled-components'
import { PostEntry, PostPageProps } from '../types'

const PostPageContainer = styled.div`
  background: linear-gradient(0deg, var(--one) 0%, var(--five) 100%);
  padding-bottom: 40px;
  margin: 0;
  padding: 0;
`

export const PostPage = ({ error, post }: PostPageProps) => {
  if (error) {
    return <div>{post}</div>
  }

  const { date, title, slug, body } = post as PostEntry

  return (
    <PostPageContainer>
      <h1>
        {title} - {date}
      </h1>
      <h2>{slug}</h2>
      <Markdown {...DEFAULT_MARKDOWN_OPTIONS} value={body} />
    </PostPageContainer>
  )
}
