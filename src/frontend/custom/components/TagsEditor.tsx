import { BaseInput, BaseTag } from 'frontend/components/Form/baseComponents'
import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { GenericEntry } from 'types/types-custom'

const TagEditorContainer = styled.div`
  position:relative;
`

const Tag = styled(BaseTag)`
  padding: 0 25px 0 5px;

  button {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 20px;
    padding: 0;
    border-radius: 2px;
    text-align: center;
    line-height: 14px;
    font-size: 14px;
    margin: auto;
    border: 0;
    background: red;
    color: white;
    font-weight: bold;
  }
`

const EnterHint = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0 5px;
  margin: auto;
  color:#ccc;
`

export const TagsEditor = ({
  entry,
  setEntry,
}: {
  entry: GenericEntry
  setEntry: Dispatch<SetStateAction<GenericEntry>>
}) => {
  const [tagValue, setTagValue] = useState<string>('')
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setTagValue(event.currentTarget.value)
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !entry.tags.includes(tagValue.trim())) {
      addTag(tagValue)
      setTagValue('')
    }
  }
  const addTag = (tag: string) => {
    const newTags = entry.tags
    newTags.push(tag.trim())
    setEntry({ ...entry, tags: newTags })
  }
  const handleRemoveClick = (tag: string) => {
    const index = entry.tags.indexOf(tag)
    if (index > -1) {
      const newTags = entry.tags
      newTags.splice(index, 1)
      setEntry({ ...entry, tags: newTags })
    }
  }
  return (
    <div>
      <TagEditorContainer>
        <BaseInput
          placeholder='Start typing a tag...'
          value={tagValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {entry.tags.includes(tagValue.trim()) ? (
          <EnterHint>Tag already exists!</EnterHint>
        ) : (
          <>
            {tagValue.trim().length > 0 && (
              <EnterHint>Press Enter to save tag</EnterHint>
            )}
          </>
        )}
        {entry.tags.map((tag) => {
          return (
            <Tag key={tag}>
              <span>{tag}</span>
              <button onClick={() => handleRemoveClick(tag)}>x</button>
            </Tag>
          )
        })}
      </TagEditorContainer>
    </div>
  )
}
