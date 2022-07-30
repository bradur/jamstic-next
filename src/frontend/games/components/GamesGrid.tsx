import { EntriesContainer } from 'frontend/components/EntriesContainer'
import { FilterContainer } from 'frontend/components/FilterContainer'
import { FilterInfoContainer } from 'frontend/components/FilterInfoContainer'
import { useFilter } from 'frontend/lib/filterContext'
import { filterGameEntries, findTagsFromJams, sortGameEntries } from 'frontend/lib/filterFunctions'
import { Jam } from '../../../backend/api/jams/types'
import { FilterControl } from '../../components/FilterControl'
import { SortingControl } from '../../components/SortingControl'
import { GamesPageGame } from './GamesPageGame'

type Props = {
  jams: Jam[]
}

export const GamesGrid = ({ jams }: Props) => {
  const entries = jams.map((jam) => jam.entries).flat()
  const tags = findTagsFromJams(jams)
  const { sorting, filter } = useFilter()
  const entryArray = entries.filter((entry) => filterGameEntries(filter, entry))

  entryArray.sort((entry, otherEntry) => sortGameEntries(sorting, entry, otherEntry))

  return (
    <>
      <FilterContainer>
        <SortingControl />
        <FilterControl initialTags={tags} />
      </FilterContainer>
      <FilterInfoContainer>
        <div>
          {entryArray.length} / {entries.length} games
        </div>
      </FilterInfoContainer>
      <EntriesContainer>
        {entryArray.map((entry) => (
          <GamesPageGame key={entry.id} {...entry} />
        ))}
      </EntriesContainer>
    </>
  )
}

export default GamesGrid
