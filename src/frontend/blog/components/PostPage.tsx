import PageBreadcrumb from 'frontend/games/components/PageBreadcrumb'
import styled from 'styled-components'
import { PostPageProps } from '../../../types/types-blog'
import { RenderedPost } from './RenderedPost'

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

  return (
    <PostPageContainer>
      <PageBreadcrumb route={'blog'} />
      <RenderedPost post={post} />
    </PostPageContainer>
  )
}

export default PostPage
