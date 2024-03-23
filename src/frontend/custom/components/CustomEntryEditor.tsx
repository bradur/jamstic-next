import { postApi } from '@lib/fetch-helper'
import { RelativePath, slugifyPath } from '@lib/relative-path-helper'
import { EntriesContainer } from 'frontend/components/EntriesContainer'
import { BaseButton, BaseInput, BaseTextarea } from 'frontend/components/Form/baseComponents'
import { ImageUpload, OnImageUploadProps } from 'frontend/components/ImageUpload'
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
  box-shadow: 0px 0px 10px 5px #ccc;
  position:fixed;
  margin-top:20px;
  right:20px;
  left:20px;
  bottom:20px;
  top:40px;
  background:#fff;
  border:1px solid #ccc;
  padding-top:40px;
`
const CustomEntryPageContainer = styled.div`
  padding:100px;
  width:1280px;
  zoom: 0.5;
`
const PreviewPlaceholder = styled.div`
  font-style:italic;
  color:#ccc;
`
const CustomEntryEditorTaskbar = styled.div`
  position:absolute;
  z-index:10;
  right:-1px;
  top:-1px;
  height:40px;
`
const CustomEntryEditorControls = styled.div`
  background: #f9f9f9;
  position:absolute;
  right:0;
  bottom:0;
  z-index:5;
  top:0;
`

const CustomEntryEditorControlsContainer = styled.div`
  padding-left:40px;

  width:340px;

  & > div {
    padding: 5px 20px;
    width:100%;
    box-sizing:border-box;
  }

  &.hidden {
    width:0;
    padding:0;
    visibility:hidden;
  }
`
const PreviewArea = styled.div`
  padding:40px;
  padding-top:0;
  padding-right:80px;


  &.controls-visible {
    padding-right: 400px;
  }
`
const CustomEntryPreview = styled.div`
  background:#eee;
  padding:10px;
  zoom:0.5;
`
const PreviewTitle = styled.div`
  font-size:20px;
  background:#f9f9f9;
`

const CustomEntryEditorArea = styled.div`
  height: 100%;
  position: relative;
`
const CustomEntryEditorPreviewView = styled.div`
  height: 100%;
  margin-bottom:20px;
  padding:10px;
  position:relative;
`

const CustomEntryEditorShadow = styled.div`
  pointer-events:none;
  position:absolute;
  right:0;
  left:0;
  top:0;
  bottom:0;
  box-shadow: inset 0px 0px 20px 1px #000;
  z-index: 999;
`


const CustomEntryEditorPreview = styled.div`
  overflow:auto;
`
const CustomEntryEditorControlsToggle = styled(BaseButton)`
  position:absolute;
  left:-1px;
  top:-1px;
  bottom:-1px;
  
  font-weight:bold;
  padding:0;
  margin:0;
  width:40px;

  &.hidden{
    right:-1px;
    left:auto;
  }

  p {
    writing-mode: vertical-rl;
    text-orientation: upright;
    margin:auto;
  }
`
const CloseButton = styled(BaseButton)`
  margin:auto;
  height:40px;
  width:40px;
`

const CustomEntryEditorTitle = BaseInput
const SaveButton = styled(BaseButton)`
  font-size:20px;
  width:100%;
  height:40px;
`
type Props = {
  closeCallback: DispatchWithoutAction
  forceUpdate?: DispatchWithoutAction
}
const defaultEntry = {
  name: '',
  slug: '',
  categorySlug: 'other',
  description: '',
  body: '',
  url: '',
  tags: [],
  cover: { type: EntryImageType.COVER, originalUrl: '' },
  links: [],
  coverColors: { css: '', colors: [] },
  date: new Date().getTime(),
}


export const CustomEntryEditor = ({ closeCallback, forceUpdate }: Props) => {
  const [entryHasChanged, setEntryHasChanged] = useState<boolean>(false)
  const [entry, setEntry] = useState<GenericEntry>({ ...defaultEntry })

  const setEditorValue = (value: string) => {
    setEntry({ ...entry, body: value })
  }
  const [editor] = useState(() => withReact(createEditor()))


  const onUpload = async ({ coverColors, imageAsB64, imageUrl }: OnImageUploadProps) => {
    setEntry({
      ...entry,
      cover: {
        base64: imageAsB64,
        originalUrl: imageUrl,
        type: EntryImageType.COVER,
      },
      coverColors,
    })
    setEntryHasChanged(true)
  }
  const handleSaveButtonClick = async () => {
    await postApi<string>({ url: '/api/jams/new', body: JSON.stringify({ entry }) })
    if (forceUpdate !== undefined) {
      forceUpdate()
    }
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.target.value)
    setEntry({ ...entry, description: event.target.value })
    setEntryHasChanged(true)
  }
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({ ...entry, name: event.target.value, slug: slugifyPath(event.target.value) })
    setEntryHasChanged(true)
  }
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({ ...entry, url: event.target.value })
    setEntryHasChanged(true)
  }
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({ ...entry, date: new Date(event.target.value).getTime() })
    setEntryHasChanged(true)
  }
  const [isHidden, setIsHidden] = useState<boolean>(false)
  const handleToggle = () => {
    setIsHidden(!isHidden);
  }
  const router = useRouter()
  const link = RelativePath.LinkHref(router, RelativePath.CustomEntry(entry.categorySlug, entry.slug)).pathname
  const handleClose = () => {
    closeCallback()
  }
  return (
    <CustomEntryEditorContainer>
      <CustomEntryEditorTaskbar>
        <CloseButton onClick={handleClose}>X</CloseButton>
      </CustomEntryEditorTaskbar>
      <CustomEntryEditorArea>
        <CustomEntryEditorControls>
          <CustomEntryEditorControlsToggle className={isHidden ? 'hidden' : ''} onClick={handleToggle}><p>{isHidden ? '<<<' : '>>>'}</p></CustomEntryEditorControlsToggle>
          <CustomEntryEditorControlsContainer className={isHidden ? 'hidden' : ''}>
            <div>
              <CustomEntryEditorTitle placeholder={'Title'} onChange={handleTitleChange} />
            </div>
            <div>
              <CustomEntryEditorTitle placeholder={'Original url'} onChange={handleUrlChange} />
            </div>
            <div>
              <ImageUpload onUpload={onUpload} />
            </div>
            <LinksEditor entry={entry} setEntry={setEntry} />
            <TagsEditor entry={entry} setEntry={setEntry} />
            <div>
              <BaseInput onChange={handleDateChange} type='datetime-local' />
            </div>
            <div>
              <BaseTextarea
                rows={2}
                placeholder={'Description'}
                value={entry.description}
                onChange={handleDescriptionChange}
              ></BaseTextarea>
            </div>
            <div>
              <MarkdownEditor
                editableProps={{ rows: 30, placeholder: 'Entry body', style: { minHeight: '100px' } }}
                editor={editor}
                setValue={setEditorValue}
              />
            </div>
            <SaveButton onClick={handleSaveButtonClick}>Save</SaveButton>
          </CustomEntryEditorControlsContainer>
        </CustomEntryEditorControls>

        <PreviewArea className={isHidden ? '' : 'controls-visible'}>
          <PreviewTitle>Preview: entry page (50% zoom)</PreviewTitle>
          <CustomEntryEditorPreviewView>
            {entryHasChanged ? (
              <>
                <CustomEntryEditorShadow />
                <CustomEntryEditorPreview>
                  <CustomEntryPageContainer>
                    <CustomEntryPage entry={entry} hideBreadcrumb={true} />
                  </CustomEntryPageContainer>
                </CustomEntryEditorPreview>
              </>
            ) : (
              <PreviewPlaceholder>- Edit the form -</PreviewPlaceholder>
            )}
          </CustomEntryEditorPreviewView>
          <PreviewTitle>Preview: Grid (50% zoom)</PreviewTitle>
          {entryHasChanged ? (
            <CustomEntryPreview>
              <EntriesContainer>
                {[...Array(6)].map(_index => (
                  <CustomEntriesPageEntry entry={entry} />
                ))}
              </EntriesContainer>
            </CustomEntryPreview>
          ) : (
            <PreviewPlaceholder>- Edit the form -</PreviewPlaceholder>
          )}
        </PreviewArea>

      </CustomEntryEditorArea>
    </CustomEntryEditorContainer>
  )
}
