import { postApi } from '@lib/fetch-helper'
import { RelativePath, slugifyPath } from '@lib/relative-path-helper'
import { EntriesContainer } from 'frontend/components/EntriesContainer'
import { BaseButton, BaseInput, BaseLabel, BaseTextarea } from 'frontend/components/Form/baseComponents'
import { ImageUpload } from 'frontend/components/ImageUpload'
import { MarkdownEditor } from 'frontend/editor/MarkdownEditor'
import { useRouter } from 'next/router'
import { DispatchWithoutAction, useState } from 'react'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import styled from 'styled-components'
import { EntryImageType, GenericEntry } from 'types/types-custom'
import CustomEntriesPageEntry from './CustomEntriesPageEntry'
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
const CustomEntryEditorTitle = BaseInput
const SaveButton = BaseButton
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
    setEntry({
      ...entry,
      cover: {
        base64: imageAsB64,
        originalUrl: imageUrl,
        type: EntryImageType.COVER,
      },
    })
  }
  const handleSaveButtonClick = async () => {
    await postApi<string>({ url: '/api/jams/new', body: JSON.stringify({ entry }) })
    forceUpdate()
  }

  const handleTextareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({ ...entry, name: event.target.value, slug: slugifyPath(event.target.value) })
  }
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({ ...entry, date: new Date(event.target.value).getTime() })
  }
  const router = useRouter()
  const link = RelativePath.LinkHref(router, RelativePath.CustomEntry(entry.categorySlug, entry.slug)).pathname
  return (
    <CustomEntryEditorContainer>
      <h1>Create new entry</h1>
      <CustomEntryEditorControls>
        <BaseLabel>Title</BaseLabel>
        <CustomEntryEditorTitle placeholder={'Title'} onChange={handleTextareaChange} />
        <BaseLabel>Cover image</BaseLabel>
        <ImageUpload onUpload={onUpload} />
        <BaseLabel>Links</BaseLabel>
        <LinksEditor entry={entry} setEntry={setEntry} />
        <BaseLabel>Tags</BaseLabel>
        <TagsEditor entry={entry} setEntry={setEntry} />
        <BaseLabel>Date</BaseLabel>
        <BaseInput onChange={handleDateChange} type='datetime-local' />
        <BaseLabel>Description</BaseLabel>
        <BaseTextarea rows={6} placeholder={'Description'} value={entry.description}></BaseTextarea>
        <BaseLabel>Body</BaseLabel>
        <MarkdownEditor placeholder={'Entry body'} editor={editor} setValue={setEditorValue} />
        <SaveButton onClick={handleSaveButtonClick}>Save</SaveButton>
      </CustomEntryEditorControls>
      <h2>Preview</h2>
      <ul>
        <li>Slug: {entry.slug}</li>
        <li>url: {link}</li>
      </ul>
      <EntriesContainer>
        <CustomEntriesPageEntry entry={entry} />
      </EntriesContainer>
      <CustomEntryPageContainer>
        <CustomEntryPage entry={entry} hideBreadcrumb={true} />
      </CustomEntryPageContainer>
    </CustomEntryEditorContainer>
  )
}
