import { customStaticPathsSlug, customStaticSlug } from 'backend/customBackend'
import Head from 'next/head'
import { CustomEntryPage } from '../../frontend/custom/components/CustomEntryPage'
import { CustomEntryPageProps, GenericEntry } from '../../types/types-custom'

const CustomEntry = (props: CustomEntryPageProps) => {
  console.log('customEntry')
  if (props.error !== false) {
    return <div>{props.error}</div>
  }
  return (
    <>
      <Head>
        <title>jamsticnext - {(props.data as GenericEntry).name}</title>
      </Head>
      <CustomEntryPage {...(props.data as GenericEntry)} />
    </>
  )
}

export default CustomEntry

export const getStaticProps = customStaticSlug()

export const getStaticPaths = customStaticPathsSlug()
