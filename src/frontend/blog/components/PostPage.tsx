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

export const RenderedPost = ({ post: { date, title, body } }: { post: PostEntry }) => {
  return (
    <>
      <h1>
        {title} - {formatDate(date)}
      </h1>
      <Markdown {...DEFAULT_MARKDOWN_OPTIONS} value={body} />
    </>
  )
}

export const PostPage = ({ error, post }: PostPageProps) => {
  if (error || post === null) {
    return <div>{error}</div>
  }

  return (
    <PostPageContainer>
      <PageBreadcrumb route={'blog'} />
      <RenderedPost post={post} />
    </PostPageContainer>
  )
}

export default PostPage
