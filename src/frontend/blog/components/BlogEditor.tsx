import { postApi } from '@lib/fetch-helper'
import { slugifyPath } from '@lib/relative-path-helper'
import { MarkdownEditor } from 'frontend/editor/MarkdownEditor'
import { useState } from 'react'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import styled from 'styled-components'
import { PostEntry } from 'types/types-blog'
import { RenderedPost } from './RenderedPost'

const BlogEditorContainer = styled.div``

const SaveButton = styled.button`
  color: orange;
  font-weight: bold;
  background: transparent;
  border: 1px solid orange;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  margin: 5px 0;

  &:hover {
    background: rgba(255, 152, 0, 0.24);
    color: black;
  }
`
export const BlogEditor = () => {
  const originalValue = ''
  const [post, setPost] = useState<PostEntry>({ date: new Date(), title: '', body: '', slug: '', id: -1 })

  const setEditorValue = (value: string) => {
    setPost({ ...post, body: value })
  }
  const [editor] = useState(() => withReact(createEditor()))
  const handleSaveButtonClick = async () => {
    await postApi<string>({ url: '/api/blog/test', body: JSON.stringify(post) })
  }

  const handleTextareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, title: event.target.value, slug: slugifyPath(event.target.value) })
  }
  return (
    <BlogEditorContainer>
      <input onChange={handleTextareaChange} />
      <MarkdownEditor editor={editor} setValue={setEditorValue} />
      <RenderedPost post={post} />
      <SaveButton onClick={handleSaveButtonClick}>Save</SaveButton>
    </BlogEditorContainer>
  )
}
