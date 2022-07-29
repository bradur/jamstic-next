import { customStaticProps } from '../../backend/customBackend'
import { CustomEntriesPage } from '../../frontend/custom/components/CustomEntriesPage'
import { CustomPageProps } from '../../types/types-custom'

const CustomEntries = (props: CustomPageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }

  return (
    <>
      <CustomEntriesPage {...props} />
    </>
  )
}

export default CustomEntries

export const getStaticProps = customStaticProps()
