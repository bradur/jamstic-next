import { useFilter } from 'frontend/lib/filterContext'
import styled from 'styled-components'

const FilterControlContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const TagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-wrap: wrap;
`

const TagButton = styled.button`
  cursor: pointer;
  color: cyan;
  border-radius: 5px;
  border: 1px solid cyan;
  font-size: 16px;
  background: white;
  color: cyan;
  padding: 5px 15px;
  margin: 5px;
  min-width: 100px;
  margin-left: 30px;

  &.tag-active {
    color: white;
    background: cyan;
  }
`

export const FilterControl = ({ initialTags }: { initialTags: string[] }) => {
  const { filter, setFilter } = useFilter()

  const selectTag = (tag: string) => {
    const newTags = [...filter.tags]
    if (newTags.includes(tag)) {
      newTags.splice(newTags.indexOf(tag), 1)
    } else {
      newTags.push(tag)
    }
    setFilter({
      ...filter,
      tags: newTags,
    })
  }

  return (
    <FilterControlContainer>
      <div>Tags:</div>
      <TagContainer>
        {initialTags.map((tag) => (
          <TagButton
            key={tag}
            className={filter.tags.includes(tag) ? 'tag-active' : 'tag'}
            onClick={() => selectTag(tag)}
          >
            {tag}
          </TagButton>
        ))}
      </TagContainer>
    </FilterControlContainer>
  )
}

export default FilterControl
