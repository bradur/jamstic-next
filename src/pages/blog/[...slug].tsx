import { blogStaticSlugPaths, blogStaticSlugProps } from 'backend/blogBackend'
import { PostPage } from '../../frontend/blog/components/PostPage'
import { PostPageProps } from '../../types/types-blog'

const Post = (props: PostPageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }
  return (
    <>
      <PostPage {...props} />
    </>
  )
}

export default Post

export const getStaticProps = blogStaticSlugProps()

export const getStaticPaths = blogStaticSlugPaths()
