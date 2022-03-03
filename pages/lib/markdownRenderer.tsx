import { createHash } from 'crypto'
import { GameLink } from 'games/components/GameLink'
import Image from 'next/image'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { solarizedLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import styled from 'styled-components'

const VideoEmbedContainer = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-left: 10px solid #eee;
  background: #f9f9f9;
`

const ParagraphAsDiv = styled.div`
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
`

export const getMarkedRenderer = () => ({
  renderer: {
    code: (source: string, lang = 'txt') => {
      return (
        <SyntaxHighlighter language={lang} style={solarizedLight}>
          {source}
        </SyntaxHighlighter>
      )
    },
    image: (href: string, title: string, text: string) => {
      return (
        <div className='jamstic-image'>
          <a href={href}>
            <Image width={320} height={180} alt={title} src={href} />
          </a>
          <div className='jamstic-image-title'>{text}</div>
        </div>
      )
    },
    link: (href: string, title: string, text: string) => {
      const url = new URL(href ?? '#')
      if (['www.youtube.com', 'youtu.be'].includes(url.hostname)) {
        let videoHash = ''
        if (url.hostname === 'youtu.be') {
          videoHash = url.pathname.replace('/', '')
        } else {
          videoHash = url.searchParams.get('v') ?? '#'
        }
        if (videoHash) {
          const iframeOptions = {
            width: 560,
            height: 315,
            frameBorder: 0,
            allowFullscreen: true,
            src: `//www.youtube.com/embed/${videoHash}`,
          }
          return (
            <VideoEmbedContainer>
              <iframe {...iframeOptions} />
              <GameLink href={href} title={href} />
            </VideoEmbedContainer>
          )
        }
      }
      return (
        <a href={href} title={title}>
          {text}
        </a>
      )
    },
    paragraph: (text: string) => {
      const hash = createHash('md5').update(JSON.stringify(text)).digest('hex')
      return <ParagraphAsDiv key={hash}>{text}</ParagraphAsDiv>
    },
  },
})
