import { DEFAULT_MARKDOWN_OPTIONS } from '@lib/constants'
import { ago, formatDate, parseDate } from '@lib/date'
import Markdown from 'marked-react'
import Link from 'next/link'
import styled from 'styled-components'
import { PostEntry } from 'types/types-blog'

type RenderedPostProps = {
  post: PostEntry
  isPreview?: boolean
  link?: { pathname: string }
}
const RenderedPostContainer = styled.div`
  background: #f9f9f9;
  margin: 50px 0;
  position: relative;
`
const PostContent = styled.div<{ isPreview: boolean }>`
  margin: 20px;
  padding: 20px;
  min-height: 100px;
  font-size: 20px;
  line-height: 2em;
  hyphens: auto;
  background: white;
  max-height: ${(props) => (props.isPreview ? '300px' : 'auto')};
  overflow: hidden;
  position: relative;
  box-sizing: border-box;

  &:after {
    ${(props) => (props.isPreview ? "content: '';" : '')}
    background: linear-gradient(0deg, #f9f9f9 30%, #f9f9f900 80%);
    height: 100px;
    left: 0;
    right: 0;
    position: absolute;
    top: 200px;
  }
`

const PostReadMoreLink = styled.div`
  font-size: 20px;
  height: 40px;
  position: absolute;
  z-index: 2;
  right: 0;
  left: 0;
  margin: auto;
  text-align: center;
  width: 200px;
  top: 260px;
`

const PostTop = styled.div`
  padding: 10px 20px;
`
const PostDate = styled.div`
  font-size: 20px;
  padding: 10px 20px;
`
const PostTitle = styled.div`
  font-size: 40px;
  cursor: pointer;
`

export const RenderedPost = ({ post, link = { pathname: '' }, isPreview = false }: RenderedPostProps) => {
  return (
    <RenderedPostContainer>
      <PostTop>
        <PostTitle>
          {isPreview ? (
            <Link href={link}>
              <a rel='prefetch'>{post.title}</a>
            </Link>
          ) : (
            <>{post.title}</>
          )}
        </PostTitle>
      </PostTop>
      <PostContent isPreview={isPreview}>
        <Markdown {...DEFAULT_MARKDOWN_OPTIONS} value={post.body} />
        {isPreview && (
          <PostReadMoreLink>
            <Link href={link}>
              <a rel='prefetch'>Read more</a>
            </Link>
          </PostReadMoreLink>
        )}
      </PostContent>
      <PostDate title={formatDate(post.date)}>{ago(parseDate(post.date))}</PostDate>
    </RenderedPostContainer>
  )
}
