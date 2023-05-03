import React, { Dispatch, SetStateAction, useState } from 'react'
import { GenericEntry } from 'types/types-custom'

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
        Tags
        <input value={tagValue} onChange={handleChange} onKeyDown={handleKeyDown} />
        {entry.tags.map((tag) => {
          return (
            <div>
              <span>{tag}</span>
              <button onClick={() => handleRemoveClick(tag)}>x</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
