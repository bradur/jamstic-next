import * as React from 'react'

export type Filter = {
  mode: 'Include' | 'Exclude'
  tags: string[]
}

export enum SortBy {
  Date = 'date',
  Name = 'name',
  Result = 'result',
}

export type Sorting = {
  direction: 'Ascending' | 'Descending'
  by: SortBy
}

type FilterProviderProps = { children: React.ReactNode }
type FilterContextProps = {
  filter: Filter
  sorting: Sorting
  setFilter: (newFilter: Filter) => void
  setSorting: (newSorting: Sorting) => void
}
const FilterContext = React.createContext<FilterContextProps | undefined>(undefined)

export const FilterProvider = ({ children }: FilterProviderProps): JSX.Element => {
  const [filter, setFilter] = React.useState<Filter>({ mode: 'Include', tags: [] })
  const [sorting, setSorting] = React.useState<Sorting>({ direction: 'Descending', by: SortBy.Date })

  return <FilterContext.Provider value={{ filter, setFilter, sorting, setSorting }}>{children}</FilterContext.Provider>
}
export const useFilter = (): FilterContextProps => {
  const context = React.useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}
