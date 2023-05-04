import { BaseInput } from 'frontend/components/Form/baseComponents'
import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { GenericEntry } from 'types/types-custom'

const Tag = styled.div`
  display: inline-block;
  margin: auto;
  margin-top: 5px;
  margin-right: 5px;
  padding: 0 25px 0 5px;
  border-radius: 3px;
  background: white;
  border: 1px solid #ccc;
  position: relative;
  height: 20px;
  line-height: 20px;

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
    if (event.key === 'Enter') {
      addTag(tagValue)
      setTagValue('')
    }
  }
  const addTag = (tag: string) => {
    const newTags = entry.tags
    newTags.push(tag)
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
      <div>
        <BaseInput value={tagValue} onChange={handleChange} onKeyDown={handleKeyDown} />
        {entry.tags.map((tag) => {
          return (
            <Tag>
              <span>{tag}</span>
              <button onClick={() => handleRemoveClick(tag)}>x</button>
            </Tag>
          )
        })}
      </div>
    </div>
  )
}
