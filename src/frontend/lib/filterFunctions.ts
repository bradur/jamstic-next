import { Jam } from 'backend/api/jams/types'
import { GenericEntry } from 'types/types-custom'
import { GameEntry } from 'types/types-games'
import { Filter, SortBy, Sorting } from './filterContext'

export const findTagsFromJams = (jams: Jam[]) => {
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

export const findTags = (entries: GenericEntry[]) => {
  const tags: string[] = []
  for (const entry of entries) {
    for (const tag of entry.tags) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }
  return tags
}

export const compareNumber = (sorting: Sorting, a: number, b: number) => {
  if (sorting.direction === 'Ascending') {
    return a - b
  } else {
    return b - a
  }
}

export const compareString = (sorting: Sorting, a: string, b: string) => {
  if (sorting.direction === 'Ascending') {
    return a.localeCompare(b)
  } else {
    return b.localeCompare(a)
  }
}

export const sortGameEntries = (sorting: Sorting, entry: GameEntry, otherEntry: GameEntry) => {
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

export const filterGameEntries = (filter: Filter, entry: GameEntry) => {
  if (filter.tags.length > 0) {
    return filter.tags.every((tag) => entry.game.tags.includes(tag))
  }
  return true
}

export const sortEntries = (sorting: Sorting, entry: GenericEntry, otherEntry: GenericEntry) => {
  if (sorting.by === SortBy.Date) {
    return compareNumber(sorting, entry.date, otherEntry.date)
  }
  if (sorting.by === SortBy.Name) {
    return compareString(sorting, entry.name, otherEntry.name)
  }
  return sorting.direction === 'Ascending' ? -1 : 1
}

export const filterEntries = (filter: Filter, entry: GenericEntry) => {
  if (filter.tags.length > 0) {
    return filter.tags.every((tag) => entry.tags.includes(tag))
  }
  return true
}
