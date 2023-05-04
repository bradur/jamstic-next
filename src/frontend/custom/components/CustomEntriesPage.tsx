import { getApi } from '@lib/fetch-helper'
import { FilterProvider } from 'frontend/lib/filterContext'
import { useState } from 'react'
import styled from 'styled-components'
import { isDevelopment } from 'utils'
import { CustomPageProps, GenericEntry } from '../../../types/types-custom'
import { CustomEntryEditor } from './CustomEntryEditor'
import { CustomEntryGrid } from './CustomEntryGrid'

const CustomPageContainer = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding-bottom: 100px;

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
  const [entries, setEntries] = useState<GenericEntry[]>(props.entries)

  const forceUpdate = async () => {
    const resp = await getApi<GenericEntry[]>({ url: '/api/jams/other' })
    setEntries(resp)
  }

  return (
    <FilterProvider>
      {isDevelopment && <CustomEntryEditor forceUpdate={forceUpdate} />}
      <CustomPageContainer>
        <h1>Custom games & projects </h1>
        <CustomEntryGrid error={props.error} entries={entries}></CustomEntryGrid>
      </CustomPageContainer>
    </FilterProvider>
  )
}

export default CustomEntriesPage
