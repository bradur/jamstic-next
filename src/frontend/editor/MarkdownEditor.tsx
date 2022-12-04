import { Dispatch, SetStateAction } from 'react'
import { Descendant, Node } from 'slate'
import { Editable, Slate } from 'slate-react'
import styled from 'styled-components'
import { CustomEditor } from './editorTypes'

const MarkdownEditorContainer = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f9f9f9;
`

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '# Title' }],
  },
]

const serialize = (nodes: Node[]) => {
  return nodes.map((n) => Node.string(n)).join('\n')
}

export const MarkdownEditor = ({
  editor,
  setMarkdown,
}: {
  editor: CustomEditor
  setMarkdown: Dispatch<SetStateAction<string>>
}) => {
  return (
    <MarkdownEditorContainer>
      <Slate
        editor={editor}
        value={initialValue}
        onChange={(value) => {
          const isARealChange = editor.operations.some((operation) => operation.type !== 'set_selection')
          if (isARealChange) {
            setMarkdown(serialize(value))
          }
        }}
      >
        <Editable />
      </Slate>
    </MarkdownEditorContainer>
  )
}
