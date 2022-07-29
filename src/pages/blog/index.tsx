import { postPath } from '@lib/relative-path-helper'
import { blogStaticProps } from 'backend/blogBackend'
import { PostsPageProps } from 'types/types-blog'

const BlogEntries = (props: PostsPageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }

  return (
    <>
      <div>
        {props.posts.map((post) => (
          <a key={post.fullPath} href={`blog/2022/${post.parentDirectory}/${postPath(post)}`}>
            {post.fileName}
          </a>
        ))}
      </div>
    </>
  )
}

export default BlogEntries

export const getStaticProps = blogStaticProps()
