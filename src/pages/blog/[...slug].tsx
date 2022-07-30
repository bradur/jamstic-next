import { blogStaticSlugPaths, blogStaticSlugProps } from 'backend/blogBackend'
import { GenericPageContainer } from 'frontend/components/GenericPageContainer'
import Head from 'next/head'
import { PostPage } from '../../frontend/blog/components/PostPage'
import { PostPageProps } from '../../types/types-blog'

const Post = (props: PostPageProps) => {
  if (props.error !== false || props.post === null) {
    return <div>{props.error}</div>
  }
  return (
    <GenericPageContainer>
      <Head>
        <title>jamstic - {props.post.title}</title>
      </Head>
      <PostPage {...props} />
    </GenericPageContainer>
  )
}

export default Post

export const getStaticProps = blogStaticSlugProps()

export const getStaticPaths = blogStaticSlugPaths()
