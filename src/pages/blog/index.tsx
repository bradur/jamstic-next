import { blogStaticProps } from 'backend/blogBackend'
import { BlogHome } from 'frontend/blog/components/BlogHome'
import { GenericPageContainer } from 'frontend/components/GenericPageContainer'
import Head from 'next/head'
import { PostsPageProps } from 'types/types-blog'

const BlogEntries = (props: PostsPageProps) => {
  return (
    <GenericPageContainer>
      <Head>
        <title>jamstic - Blog</title>
      </Head>
      <BlogHome {...props} />
    </GenericPageContainer>
  )
}

export default BlogEntries

export const getStaticProps = blogStaticProps()
