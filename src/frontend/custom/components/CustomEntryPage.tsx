import { RelativePath } from '@lib/relative-path-helper'
import { PageBreadcrumb } from 'frontend/games/components/PageBreadcrumb'
import { DEFAULT_MARKDOWN_OPTIONS } from 'frontend/lib/constants'
import Markdown from 'marked-react'
import emoji from 'node-emoji'
import styled from 'styled-components'
import { GenericEntry } from '../../../types/types-custom'
import { CustomEntryContainer } from './CustomEntryContainer'
import { CustomEntryMeta } from './CustomEntryMeta'

const PageContainer = styled.div`
  background: linear-gradient(0deg, var(--one) 0%, var(--five) 100%);
  margin: 0;
  padding: 0;
  flex-grow: 1;
`
const CustomEntryContentContainer = styled.div`
  position: relative;
`

const CustomEntryCoverImg = styled.div`
  max-width: 920px;
  height: 400px;
  box-shadow: inset 0px 5px 3px 1px var(--one);
  margin-bottom: 5px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  img:hover {
    object-fit:contain;
  }
`

const PageContainerWithCoverColors = styled(PageContainer) <{
  coverColors: string
}>`
  ${(props) => props.coverColors}
`

const CustomEntryTitle = styled.h1`
  margin: auto;
  text-align: left;
  font-size: 50px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border: 0;
  background: linear-gradient(to top, var(--one), var(--five));
  margin-bottom: 5px;
  text-shadow: 2px 2px 0px black;
  color: #fff;
`

const CustomEntryDescription = styled.div`
  background: #fff;
  font-style: italic;
  padding: 20px;
`

export const CustomEntryPage = ({
  entry,
  hideBreadcrumb = true,
}: {
  entry: GenericEntry
  hideBreadcrumb?: boolean
}) => {
  const coverUrl = RelativePath.Image('custom', entry.categorySlug, entry.slug, entry.cover)
  const body = emoji.emojify(entry.body)

  return (
    <PageContainerWithCoverColors coverColors={entry.coverColors.css}>
      {!hideBreadcrumb && <PageBreadcrumb route={'custom'} />}

      <CustomEntryContainer>
        <CustomEntryTitle>{entry.name}</CustomEntryTitle>
        <CustomEntryMeta {...entry} />
        <CustomEntryCoverImg className='custom-entry-meta-cover'>
          <img src={entry.cover.base64} />
        </CustomEntryCoverImg>
        <CustomEntryContentContainer>
          <CustomEntryDescription>{entry.description}</CustomEntryDescription>
          <div className='custom-entry-content'>
            <Markdown {...DEFAULT_MARKDOWN_OPTIONS} value={body} />
          </div>
        </CustomEntryContentContainer>
      </CustomEntryContainer>
    </PageContainerWithCoverColors>
  )
}

export default CustomEntryPage
