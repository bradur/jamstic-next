import { Descendant, Node } from 'slate'
import { Editable, Slate } from 'slate-react'
import { EditableProps } from 'slate-react/dist/components/editable'
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

type MarkdownEditorProps = {
  editor: CustomEditor
  setValue: (value: string) => void
  editableProps?: EditableProps
}

export const MarkdownEditor = ({ editor, setValue, editableProps = {} }: MarkdownEditorProps) => {
  const { placeholder = 'Type something here' } = editableProps
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
        <Editable {...editableProps} placeholder={placeholder} />
      </Slate>
    </MarkdownEditorContainer>
  )
}
