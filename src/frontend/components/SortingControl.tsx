import { faArrowDownShortWide, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SortBy, useFilter } from 'frontend/lib/filterContext'
import styled from 'styled-components'

const SortingContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const SortButton = styled.div`
  position: relative;

  &.sorting-active {
    color: white;
  }

  .sorting-select,
  .sorting-direction {
    background: none;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid #000;
    font-size: 16px;
  }

  .sorting-direction {
    position: absolute;
    left: 0;
    height: 30px;
    width: 30px;
    background: black;
    color: white;
  }

  .sorting-select {
    padding: 5px 15px;
    min-width: 100px;
    margin-left: 30px;
  }

  &.sorting-active .sorting-select {
    color: white;
    background: black;
  }
`

export const SortingControl = () => {
  const { sorting, setSorting } = useFilter()

  const sortables = Object.entries(SortBy)

  const selectSortable = (sortable: SortBy) => {
    setSorting({
      ...sorting,
      by: sortable,
    })
  }

  const reverseDirection = () => {
    setSorting({
      ...sorting,
      direction: sorting.direction === 'Ascending' ? 'Descending' : 'Ascending',
    })
  }

  return (
    <SortingContainer>
      <div>Sort by:</div>
      {sortables.map((sortable) => (
        <SortButton className={sorting.by === sortable[1] ? 'sorting-active' : 'sorting'} key={sortable[0]}>
          {sorting.by === sortable[1] && (
            <button className='sorting-direction' onClick={() => reverseDirection()}>
              <FontAwesomeIcon icon={sorting.direction === 'Ascending' ? faArrowDownShortWide : faArrowUpWideShort} />
            </button>
          )}
          <button className='sorting-select' onClick={() => selectSortable(sortable[1])}>
            {sortable[0]}
          </button>
        </SortButton>
      ))}
    </SortingContainer>
  )
}

export default SortingControl
