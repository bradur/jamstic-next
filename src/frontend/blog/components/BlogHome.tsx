import { DEFAULT_MARKDOWN_OPTIONS } from '@lib/constants'
import { MarkdownEditor } from 'frontend/editor/MarkdownEditor'
import Markdown from 'marked-react'
import { useState } from 'react'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import styled from 'styled-components'

const BlogHomeContainer = styled.div`
  margin-top: 5px;
  padding: 20px;
  padding-top: 5px;
  background: none;
`

export const BlogHome = () => {
  const originalValue = ''
  const [markdown, setMarkdown] = useState<string>(originalValue)
  const [editor] = useState(() => withReact(createEditor()))
  return (
    <BlogHomeContainer>
      <MarkdownEditor editor={editor} setMarkdown={setMarkdown} />
      <Markdown {...DEFAULT_MARKDOWN_OPTIONS} value={markdown} />
    </BlogHomeContainer>
  )
}
