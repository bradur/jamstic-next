import { postPath, RelativePath } from '@lib/relative-path-helper'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { PostsPageProps } from 'types/types-blog'
import { BlogEditor } from './BlogEditor'
import { RenderedPost } from './RenderedPost'

const BlogHomeContainer = styled.div`
  margin-top: 5px;
  padding: 20px;
  padding-top: 5px;
  background: none;

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style: none;
  }
`

export const BlogHome = (props: PostsPageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }

  const isDevelopment = process.env.NODE_ENV === 'development'
  const router = useRouter()
  return (
    <BlogHomeContainer>
      {isDevelopment && <BlogEditor />}
      <div>
        <h1>Blog</h1>
        <ul>
          {props.posts.map((post) => (
            <li key={post.id}>
              <RenderedPost
                {...{
                  isPreview: true,
                  post,
                  link: RelativePath.LinkHref(router, postPath(post)),
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </BlogHomeContainer>
  )
}
