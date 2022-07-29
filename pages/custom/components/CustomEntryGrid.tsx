import { useFilter } from '@lib/filterContext'
import { filterEntries, findTags, sortEntries } from '@lib/filterFunctions'
import { FilterControl } from 'components/FilterControl'
import { SortingControl } from 'components/SortingControl'
import { CustomPageProps } from 'custom/types'
import styled from 'styled-components'
import { CustomEntriesPageEntry } from './CustomEntriesPageEntry'

const FilterContainer = styled.div`
  display: flex;
  padding: 0 20px;
  margin: 15px auto;
`

const FilterInfoContainer = styled.div`
  margin-left: 15px;
  display: inline-block;
  background: cyan;
  color: white;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 5px 15px;
`

export const CustomEntryGrid = ({ entries }: CustomPageProps) => {
  const tags = findTags(entries)
  const { sorting, filter } = useFilter()
  const entryArray = entries.filter((entry) => filterEntries(filter, entry))

  entryArray.sort((entry, otherEntry) => sortEntries(sorting, entry, otherEntry))

  return (
    <>
      <FilterContainer>
        <SortingControl />
        <FilterControl initialTags={tags} />
      </FilterContainer>
      <FilterInfoContainer>
        <div>
          {entryArray.length} / {entries.length} projects
        </div>
      </FilterInfoContainer>
      <div className='games-container'>
        {entryArray.map((entry) => (
          <CustomEntriesPageEntry key={entry.categorySlug + entry.slug} {...entry} />
        ))}
      </div>
    </>
  )
}
