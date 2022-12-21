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
    children: [{ text: '' }],
  },
]

const serialize = (nodes: Node[]) => {
  return nodes.map((n) => Node.string(n)).join('\n')
}

type MarkdownEditorProps = { editor: CustomEditor; setValue: (value: string) => void; placeholder?: string }

export const MarkdownEditor = ({ editor, setValue, placeholder = 'Type something here' }: MarkdownEditorProps) => {
  return (
    <MarkdownEditorContainer>
      <Slate
        editor={editor}
        value={initialValue}
        onChange={(value) => {
          const isARealChange = editor.operations.some((operation) => operation.type !== 'set_selection')
          if (isARealChange) {
            setValue(serialize(value))
          }
        }}
      >
        <Editable placeholder={placeholder} />
      </Slate>
    </MarkdownEditorContainer>
  )
}
