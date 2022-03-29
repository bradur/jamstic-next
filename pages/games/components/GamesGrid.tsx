import { Filter, SortBy, Sorting, useFilter } from '@lib/filterContext'
import { Jam } from 'api/jams/types'
import { GameEntry } from 'games/types'
import styled from 'styled-components'
import { FilterControl } from './FilterControl'
import { GamesPageGame } from './GamesPageGame'
import { SortingControl } from './SortingControl'

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

const findTags = (jams: Jam[]) => {
  const tags: string[] = []
  for (const jam of jams) {
    for (const entry of jam.entries) {
      for (const tag of entry.game.tags) {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      }
    }
  }
  return tags
}

const compareNumber = (sorting: Sorting, a: number, b: number) => {
  if (sorting.direction === 'Ascending') {
    return a - b
  } else {
    return b - a
  }
}

const compareString = (sorting: Sorting, a: string, b: string) => {
  if (sorting.direction === 'Ascending') {
    return a.localeCompare(b)
  } else {
    return b.localeCompare(a)
  }
}

const sortEntries = (sorting: Sorting, entry: GameEntry, otherEntry: GameEntry) => {
  if (sorting.by === SortBy.Date) {
    return compareNumber(sorting, entry.event.date, otherEntry.event.date)
  }
  if (sorting.by === SortBy.Name) {
    return compareString(sorting, entry.game.name, otherEntry.game.name)
  }
  if (sorting.by === SortBy.Result) {
    return compareNumber(
      sorting,
      entry.game.results.overall.result ?? Infinity,
      otherEntry.game.results.overall.result ?? Infinity,
    )
  }
  return sorting.direction === 'Ascending' ? -1 : 1
}

const filterEntries = (filter: Filter, entry: GameEntry) => {
  if (filter.tags.length > 0) {
    return filter.tags.every((tag) => entry.game.tags.includes(tag))
  }
  return true
}

export const GamesGrid = ({ jams }: Props) => {
  const entries = jams.map((jam) => jam.entries).flat()
  const tags = findTags(jams)
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
