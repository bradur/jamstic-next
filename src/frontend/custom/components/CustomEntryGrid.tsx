import { EntriesContainer } from 'frontend/components/EntriesContainer'
import { FilterContainer } from 'frontend/components/FilterContainer'
import { FilterControl } from 'frontend/components/FilterControl'
import { FilterInfoContainer } from 'frontend/components/FilterInfoContainer'
import { SortingControl } from 'frontend/components/SortingControl'
import { useFilter } from 'frontend/lib/filterContext'
import { filterEntries, findTags, sortEntries } from 'frontend/lib/filterFunctions'
import { CustomPageProps } from '../../../types/types-custom'
import { CustomEntriesPageEntry } from './CustomEntriesPageEntry'

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
      <EntriesContainer>
        {entryArray.map((entry) => (
          <CustomEntriesPageEntry key={entry.categorySlug + entry.slug} entry={entry} />
        ))}
      </EntriesContainer>
    </>
  )
}

export default CustomEntryGrid
