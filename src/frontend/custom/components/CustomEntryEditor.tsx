import { postApi } from '@lib/fetch-helper'
import { RelativePath, slugifyPath } from '@lib/relative-path-helper'
import { ImageUpload } from 'frontend/components/ImageUpload'
import { MarkdownEditor } from 'frontend/editor/MarkdownEditor'
import { useRouter } from 'next/router'
import { DispatchWithoutAction, useState } from 'react'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import styled from 'styled-components'
import { EntryImageType, GenericEntry } from 'types/types-custom'
import CustomEntryPage from './CustomEntryPage'
import { LinksEditor } from './LinksEditor'
import { TagsEditor } from './TagsEditor'

const CustomEntryEditorContainer = styled.div`
  box-shadow: 5px 5px 11px 1px #ccc;
  margin: 10px 0;
`
const CustomEntryPageContainer = styled.div`
  margin: 10px;
  border: 1px dashed #ccc;
`
const CustomEntryEditorControls = styled.div`
  background: #f9f9f9;
  padding: 20px;
`

const CustomEntryEditorTitle = styled.input`
  margin: 20px 0;
  background: #f9f9f9;
  border-radius: 5px;
  font-size: 20px;
  line-height: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  outline: none;
  width: 100%;
  box-sizing: border-box;
`

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
export const CustomEntryEditor = ({ forceUpdate }: { forceUpdate: DispatchWithoutAction }) => {
  const [entry, setEntry] = useState<GenericEntry>({
    name: '',
    slug: '',
    categorySlug: 'other',
    description: '',
    body: '',
    url: '',
    tags: [],
    cover: { type: EntryImageType.COVER, originalUrl: '' },
    links: [],
    coverColors: { css: '' },
    date: new Date().getTime(),
  })

  const setEditorValue = (value: string) => {
    setEntry({ ...entry, body: value })
  }
  const [editor] = useState(() => withReact(createEditor()))

  const onUpload = (imageAsB64: string, imageUrl: string) => {
    entry.cover.base64 = imageAsB64
    entry.cover.originalUrl = imageUrl
  }
  const handleSaveButtonClick = async () => {
    await postApi<string>({ url: '/api/jams/new', body: JSON.stringify({ entry }) })
    forceUpdate()
  }

  const handleTextareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({ ...entry, name: event.target.value, slug: slugifyPath(event.target.value) })
  }
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log()
    //const
    setEntry({ ...entry, date: new Date(event.target.value).getTime() })
  }
  const router = useRouter()
  const link = RelativePath.LinkHref(router, RelativePath.CustomEntry(entry.categorySlug, entry.slug)).pathname
  return (
    <CustomEntryEditorContainer>
      <h1>Create new entry</h1>
      <CustomEntryEditorControls>
        <CustomEntryEditorTitle placeholder={'Title'} onChange={handleTextareaChange} />
        <ImageUpload onUpload={onUpload} />
        <LinksEditor entry={entry} setEntry={setEntry} />
        <TagsEditor entry={entry} setEntry={setEntry} />
        <input onChange={handleDateChange} type='datetime-local' />
        <textarea placeholder={'Description'} value={entry.description}></textarea>
        <MarkdownEditor placeholder={'Entry body'} editor={editor} setValue={setEditorValue} />
        <SaveButton onClick={handleSaveButtonClick}>Save</SaveButton>
      </CustomEntryEditorControls>
      <h2>Preview</h2>
      <ul>
        <li>Slug: {entry.slug}</li>
        <li>url: {link}</li>
      </ul>
      <CustomEntryPageContainer>
        <CustomEntryPage entry={entry} hideBreadcrumb={true} />
      </CustomEntryPageContainer>
    </CustomEntryEditorContainer>
  )
}
