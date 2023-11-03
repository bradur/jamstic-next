import { FakeInput } from 'frontend/components/Form/FakeInput'
import { BaseButton } from 'frontend/components/Form/baseComponents'
import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { EntryLink, GenericEntry } from 'types/types-custom'

const LinkContainer = styled.div`
  input {
    margin: auto;
    width: 50%;
  }
`
const LinkColumn = styled.div`
  display: inline-block;
  margin: auto;
  width: 50%;
  box-sizing: border-box;
`

const LinkButtonContainer = styled.div`
  display:flex;
  flex-grow:1;
`
const LinkButton = styled(BaseButton)`
  width: 150px;
  height:40px;
  font-size:20px;

  &:first-child{
    margin-right:2px;
  }
  &:last-child{
    margin-left:2px;
  }
`
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
    newLinks.push({ title: '', url: '' })
    setEntry({ ...entry, links: newLinks })
  }
  const newLinkIsEmpty =
    entry.links.length > 0 && (entry.links[0].url.trim() === '' || entry.links[0].title.trim() === '')
  return (
    <div>
      <LinkButtonContainer>
        <LinkButton onClick={handleAddClick} disabled={newLinkIsEmpty}>
          + Add link
        </LinkButton>
        <LinkButton onClick={handleRemoveClick} disabled={entry.links.length < 1}>
          - Remove link
        </LinkButton>
      </LinkButtonContainer>
      <div>
        {entry.links.map((link) => {
          return (
            <div>
              <LinkContainer>
                <LinkColumn>
                  <FakeInput
                    value={link.title}
                    onChange={(event) => handleTitleInputChange(link, event)}
                    placeholder='Title'
                  />
                </LinkColumn>
                <LinkColumn>
                  <FakeInput
                    value={link.url}
                    onChange={(event) => handleUrlInputChange(link, event)}
                    placeholder='url'
                  />
                </LinkColumn>
              </LinkContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}
