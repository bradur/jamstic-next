import { postApi } from '@lib/fetch-helper'
import { RelativePath, slugifyPath } from '@lib/relative-path-helper'
import { prominent } from 'color.js'
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
const CustomEntryEditorArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
`
const CustomEntryEditorPreview = styled.div``

const ColorTest = styled.div<{ coverColors: string }>`
  ${(props) => props.coverColors}

  div {
    display: inline-block;
    margin: auto;
    height: 50px;
    width: 50px;
  }

  .game-palette-one {
    background: var(--one);
  }
  .game-palette-two {
    background: var(--two);
  }
  .game-palette-three {
    background: var(--three);
  }
  .game-palette-four {
    background: var(--four);
  }
  .game-palette-five {
    background: var(--five);
  }
`

const relativeLuminance = (color: number[]) => {
  const min = 0.03928
  const div = 12.92

  const factor = 0.055
  const divider = 1.055
  const defo = 2.4

  const [red, green, blue] = color.map((color) => {
    const colorSmall = color / 255
    return colorSmall <= min ? colorSmall / div : Math.pow((colorSmall + factor) / divider, defo)
  })

  return red * 0.2126 + green * 0.7152 + blue * 0.0722
}

type RGBColor = [r: number, g: number, b: number]

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

  const rgbToHex = (rgbColor: RGBColor) => {
    return `#${rgbColor.map((color) => color.toString(16)).join('')}`
  }

  const onUpload = async (imageAsB64: string, imageUrl: string) => {
    ///const [one, two, three, four, five] = await prominent(imageAsB64, { amount: 5, format: 'hex', group: 20 })
    const colors = (await prominent(imageAsB64, { amount: 5, format: 'array', group: 20 })) as RGBColor[]
    colors.sort((colorA, colorB) => {
      const luminA = relativeLuminance(colorA)
      const luminB = relativeLuminance(colorB)
      if (luminA > luminB) {
        return 1
      }
      if (luminB > luminA) {
        return -1
      }
      return 0
    })
    const [one, two, three, four, five] = colors
    const css = Object.entries({ one, two, three, four, five })
      .map(([name, color]) => `--${name}: ${rgbToHex(color)};`)
      .join('')
    setEntry({
      ...entry,
      cover: {
        base64: imageAsB64,
        originalUrl: imageUrl,
        type: EntryImageType.COVER,
      },
      coverColors: {
        css,
      },
    })
  }
  const handleSaveButtonClick = async () => {
    await postApi<string>({ url: '/api/jams/new', body: JSON.stringify({ entry }) })
    forceUpdate()
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.target.value)
    setEntry({ ...entry, description: event.target.value })
  }
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <CustomEntryEditorArea>
        <CustomEntryEditorControls>
          <BaseLabel>Title</BaseLabel>
          <CustomEntryEditorTitle placeholder={'Title'} onChange={handleTitleChange} />
          <BaseLabel>Cover image</BaseLabel>
          <ImageUpload onUpload={onUpload} />
          <BaseLabel>Links</BaseLabel>
          <LinksEditor entry={entry} setEntry={setEntry} />
          <BaseLabel>Tags</BaseLabel>
          <TagsEditor entry={entry} setEntry={setEntry} />
          <BaseLabel>Date</BaseLabel>
          <BaseInput onChange={handleDateChange} type='datetime-local' />
          <BaseLabel>Description</BaseLabel>
          <BaseTextarea
            rows={2}
            placeholder={'Description'}
            value={entry.description}
            onChange={handleDescriptionChange}
          ></BaseTextarea>
          <BaseLabel>Body</BaseLabel>
          <MarkdownEditor
            editableProps={{ rows: 30, placeholder: 'Entry body' }}
            editor={editor}
            setValue={setEditorValue}
          />
          <SaveButton onClick={handleSaveButtonClick}>Save</SaveButton>
        </CustomEntryEditorControls>
        <CustomEntryEditorPreview>
          <h2>Preview</h2>
          <ul>
            <li>Slug: {entry.slug}</li>
            <li>url: {link}</li>
          </ul>
          <ColorTest coverColors={entry.coverColors.css}>
            <div className='game-palette-one'></div>
            <div className='game-palette-two'></div>
            <div className='game-palette-three'></div>
            <div className='game-palette-four'></div>
            <div className='game-palette-five'></div>
          </ColorTest>
          <EntriesContainer>
            <CustomEntriesPageEntry entry={entry} />
          </EntriesContainer>
          <CustomEntryPageContainer>
            <CustomEntryPage entry={entry} hideBreadcrumb={true} />
          </CustomEntryPageContainer>
        </CustomEntryEditorPreview>
      </CustomEntryEditorArea>
    </CustomEntryEditorContainer>
  )
}
