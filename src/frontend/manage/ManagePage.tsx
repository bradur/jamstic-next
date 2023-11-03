import { ManagePageProps } from 'backend/manageBackend'
import { BaseButtonLike } from 'frontend/components/Form/baseComponents'
import { CustomEntryEditor } from 'frontend/custom/components/CustomEntryEditor'
import { FilterProvider } from 'frontend/lib/filterContext'
import { useState } from 'react'
import styled from 'styled-components'
import { isDevelopment } from 'utils'

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

const ShowEditorButton = styled.button`
  ${BaseButtonLike}
`


export const ManagePage = (props: ManagePageProps) => {

  const [showEditor, setShowEditor] = useState<boolean>(false)

  const handleOnClick = () => {
    setShowEditor(true)
  }

  const closeEditorCallback = () => {
    setShowEditor(false)
  }

  return (
    <FilterProvider>
      {isDevelopment ? (
        <>
          {isDevelopment && <ShowEditorButton onClick={handleOnClick}>+ Add new entry</ShowEditorButton>}
          {showEditor && <CustomEntryEditor closeCallback={closeEditorCallback} />}
        </>
      )
        : (
          <p>Wrong page, bub.</p>
        )}
    </FilterProvider>
  )
}

export default ManagePage
