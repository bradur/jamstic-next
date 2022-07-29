import { ago, formatDate, parseDate } from 'frontend/lib/date'
import styled from 'styled-components'
import { GenericEntry } from '../../../types/types-custom'
import { CustomEntryLink } from './CustomEntryLink'

const CustomEntryMetaContainer = styled.div`
  position: absolute;
  right: 100%;
  height: 100%;
  width: 200px;
  top: 0;
  margin-right: 5px;

  .game-meta {
    position: sticky;
    top: 0;
    padding: 10px;
    background: #f9f9f9;
  }

  .game-event span {
    display: block;
  }

  .game-meta-section {
    margin-bottom: 20px;
  }
  .game-result {
    position: relative;
    border-bottom: 1px dotted #ccc;
    background: #fff;
    padding: 2px 5px;
  }
  .game-result-value {
    position: absolute;
    right: 5px;
    z-index: 5;
    top: 0;
    height: 100%;
  }
`

export const CustomEntryMeta = (entry: GenericEntry) => {
  return (
    <CustomEntryMetaContainer>
      <div className='game-meta'>
        <div className='game-meta-section'>
          <h2>Info</h2>
          <div className='game-publish-date' title={formatDate(entry.date)}>
            {ago(parseDate(entry.date))}
          </div>
        </div>
        <div className='game-meta-section'>
          <h2>Links</h2>
          <CustomEntryLink key={entry.url} href={entry.url} title='Original url' />
          {entry.links.map((link) => (
            <CustomEntryLink key={link.url} href={link.url} title={link.title} />
          ))}
        </div>
      </div>
    </CustomEntryMetaContainer>
  )
}

export default CustomEntryMeta
