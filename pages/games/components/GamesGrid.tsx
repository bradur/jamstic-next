import { SortBy, useFilter } from '@lib/filterContext'
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

export const GamesGrid = ({ entries }: { entries: GameEntry[] }) => {
  const { sorting, filter } = useFilter()
  const entryArray = entries.filter((entry) => {
    if (filter.tags.length > 0) {
      return filter.tags.every((tag) => entry.game.tags.includes(tag))
    }
    return true
  })
  const compareNumber = (a: number, b: number) => {
    if (sorting.direction === 'Ascending') {
      return a - b
    } else {
      return b - a
    }
  }

  const compareString = (a: string, b: string) => {
    if (sorting.direction === 'Ascending') {
      return a.localeCompare(b)
    } else {
      return b.localeCompare(a)
    }
  }
  entryArray.sort((entry, otherEntry) => {
    if (sorting.by === SortBy.Date) {
      return compareNumber(entry.event.date, otherEntry.event.date)
    }
    if (sorting.by === SortBy.Name) {
      return compareString(entry.game.name, otherEntry.game.name)
    }
    if (sorting.by === SortBy.Result) {
      return compareNumber(
        entry.game.results.overall.result ?? Infinity,
        otherEntry.game.results.overall.result ?? Infinity,
      )
    }
    return sorting.direction === 'Ascending' ? -1 : 1
  })

  return (
    <>
      <FilterContainer>
        <SortingControl />
        <FilterControl initialTags={['solo', 'team']} />
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
