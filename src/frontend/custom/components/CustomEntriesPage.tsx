import { FilterProvider } from 'frontend/lib/filterContext'
import styled from 'styled-components'
import { CustomPageProps } from '../../../types/types-custom'
import { CustomEntryGrid } from './CustomEntryGrid'

const CustomPageContainer = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding-bottom: 100px;

  .game-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 1300px) {
    .games-page {
      max-width: 100%;
    }
  }
  .game-event-name,
  .game-event-result {
    display: inline-block;
    margin: auto;
    vertical-align: top;
  }
`

export const CustomEntriesPage = (props: CustomPageProps) => {
  return (
    <FilterProvider>
      <CustomPageContainer>
        <h1>Custom games & projects </h1>
        <CustomEntryGrid {...props}></CustomEntryGrid>
      </CustomPageContainer>
    </FilterProvider>
  )
}

export default CustomEntriesPage
