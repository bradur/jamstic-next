import { formatDate } from '@lib/date'
import PageBreadcrumb from 'frontend/games/components/PageBreadcrumb'
import { DEFAULT_MARKDOWN_OPTIONS } from 'frontend/lib/constants'
import Markdown from 'marked-react'
import styled from 'styled-components'
import { PostEntry, PostPageProps } from '../../../types/types-blog'

const PostPageContainer = styled.div`
  background: linear-gradient(0deg, var(--one) 0%, var(--five) 100%);
  padding-bottom: 40px;
  margin: 0;
  padding: 0;
  min-width: 980px;
`

export const PostPage = ({ error, post }: PostPageProps) => {
  if (error || post === null) {
    return <div>{error}</div>
  }

  const { date, title, body } = post as PostEntry

  return (
    <PostPageContainer>
      <PageBreadcrumb route={'blog'} />
      <h1>
        {title} - {formatDate(date)}
      </h1>
      <Markdown {...DEFAULT_MARKDOWN_OPTIONS} value={body} />
    </PostPageContainer>
  )
}

export default PostPage
