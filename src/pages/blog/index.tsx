import { postPath, RelativePath } from '@lib/relative-path-helper'
import { blogStaticProps } from 'backend/blogBackend'
import { BlogHome } from 'frontend/blog/components/BlogHome'
import { GenericPageContainer } from 'frontend/components/GenericPageContainer'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PostsPageProps } from 'types/types-blog'

const BlogEntries = (props: PostsPageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }

  const router = useRouter()

  return (
    <GenericPageContainer>
      <Head>
        <title>jamstic - Blog</title>
      </Head>
      <BlogHome />
      <div>
        <h1>Blog</h1>
        <ul>
          {props.posts.map((post) => (
            <li key={post.id}>
              <Link href={RelativePath.LinkHref(router, postPath(post))}>
                <a rel='prefetch'>{postPath(post)}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </GenericPageContainer>
  )
}

export default BlogEntries

export const getStaticProps = blogStaticProps()
