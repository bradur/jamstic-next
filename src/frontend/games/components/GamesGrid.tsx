import { useFilter } from 'frontend/lib/filterContext'
import { filterGameEntries, findTagsFromJams, sortGameEntries } from 'frontend/lib/filterFunctions'
import styled from 'styled-components'
import { Jam } from '../../../backend/api/jams/types'
import { FilterControl } from '../../components/FilterControl'
import { SortingControl } from '../../components/SortingControl'
import { GamesPageGame } from './GamesPageGame'

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
      <div className='games-container'>
        {entryArray.map((entry) => (
          <GamesPageGame key={entry.id} {...entry} />
        ))}
      </div>
    </>
  )
}

export default GamesGrid
