import React, { Dispatch, SetStateAction } from 'react'
import { EntryLink, GenericEntry } from 'types/types-custom'

export const LinksEditor = ({
  entry,
  setEntry,
}: {
  entry: GenericEntry
  setEntry: Dispatch<SetStateAction<GenericEntry>>
}) => {
  const handleTitleInputChange = (link: EntryLink, event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    editLink(link, link.url, newValue)
  }
  const handleUrlInputChange = (link: EntryLink, event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    editLink(link, newValue, link.title)
  }
  const editLink = (link: EntryLink, url: string, title: string) => {
    const index = entry.links.indexOf(link)
    if (index > -1) {
      entry.links[index] = {
        url,
        title,
      }
      setEntry({ ...entry, links: entry.links })
    }
  }
  const handleRemoveClick = () => {
    const newLinks = entry.links
    newLinks.splice(entry.links.length - 1, 1)
    setEntry({ ...entry, links: newLinks })
  }
  const handleAddClick = () => {
    const newLinks = entry.links
    newLinks.push({ title: 'New title', url: 'http://url.here' })
    setEntry({ ...entry, links: newLinks })
  }
  return (
    <div>
      <button onClick={handleAddClick}>+ Add</button>
      <button onClick={handleRemoveClick} disabled={entry.links.length < 1}>
        - Remove
      </button>
      <div>
        {entry.links.map((link) => {
          return (
            <div>
              <input value={link.title} onChange={(event) => handleTitleInputChange(link, event)} />
              <input value={link.url} onChange={(event) => handleUrlInputChange(link, event)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
