import { JamsticLogger } from '@backendlib/logger'
import { deleteApi, getApi } from '@lib/fetch-helper'
import { RelativePath, postPath } from '@lib/relative-path-helper'
import { useRouter } from 'next/router'
import { DispatchWithoutAction, useState } from 'react'
import styled from 'styled-components'
import { PostEntry, PostsPageProps } from 'types/types-blog'
import { isDevelopment } from 'utils'
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

const PostControls = ({ post, forceUpdate }: { post: PostEntry; forceUpdate: DispatchWithoutAction }) => {
  const handleRemoveButtonClick = async () => {
    const response = await deleteApi<string>({ url: `/api/blog/${post.id}` })
    if (response === 'removed') {
      JamsticLogger.log('forceUpdate')
      forceUpdate()
    }
  }
  return (
    <div>
      <button onClick={handleRemoveButtonClick}>remove</button>
    </div>
  )
}

export const BlogHome: React.FC<PostsPageProps> = (props: PostsPageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }

  const [posts, setPosts] = useState<PostEntry[]>(props.posts)

  const forceUpdate = async () => {
    const resp = await getApi<PostEntry[]>({ url: '/api/blog/all' })
    setPosts(resp)
  }

  const router = useRouter()
  return (
    <BlogHomeContainer>
      {isDevelopment && <BlogEditor forceUpdate={forceUpdate} />}
      <div>
        <h1>Blog</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {isDevelopment && <PostControls post={post} forceUpdate={forceUpdate} />}
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
