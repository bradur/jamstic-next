import { ManagePageProps, manageStaticProps } from 'backend/manageBackend'
import { GenericPageContainer } from 'frontend/components/GenericPageContainer'
import ManagePage from 'frontend/manage/ManagePage'

const Manage = (props: ManagePageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }

  return (
    <GenericPageContainer>
      <ManagePage {...props} />
    </GenericPageContainer>
  )
}

export default Manage

export const getStaticProps = manageStaticProps()
