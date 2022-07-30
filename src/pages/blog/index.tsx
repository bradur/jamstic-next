import { postPath } from '@lib/relative-path-helper'
import { blogStaticProps } from 'backend/blogBackend'
import { GenericPageContainer } from 'frontend/components/GenericPageContainer'
import Head from 'next/head'
import Link from 'next/link'
import { PostsPageProps } from 'types/types-blog'

const BlogEntries = (props: PostsPageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }

  return (
    <GenericPageContainer>
      <Head>
        <title>jamstic - Blog</title>
      </Head>
      <div>
        <h1>Blog</h1>
        {props.posts.map((post) => (
          <Link key={post.fullPath} href={`${post.parentDirectory}/${postPath(post)}`}>
            <a rel='prefetch'>{postPath(post)}</a>
          </Link>
        ))}
      </div>
    </GenericPageContainer>
  )
}

export default BlogEntries

export const getStaticProps = blogStaticProps()
