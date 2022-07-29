import { loadSavedGenericEntries } from '@lib/file-helper'
import { GetStaticPropsResult } from 'next'
import { CustomEntriesPage } from './components/CustomEntriesPage'
import { CustomPageProps } from './types'

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

export const getStaticProps = async (): Promise<GetStaticPropsResult<CustomPageProps>> => {
  const entries = loadSavedGenericEntries('custom')
  console.log(entries.length)

  return {
    props: {
      error: false,
      entries,
    },
  }
}

export default CustomEntries
