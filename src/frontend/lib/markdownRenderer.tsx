import { createHash } from 'crypto'
import { GameLink } from 'frontend/games/components/GameLink'
import Link from 'next/link'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { rainbow } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
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


const attemptHash: { [key: string]: string } = {}
const makeHashFromSource = (source: string) => {
  const count = Object.keys(attemptHash).filter((key) => key === source)
  const hash = createHash('md5').update(source).digest('hex') + count
  return hash
}

export const getMarkedRenderer = () => ({
  code: (source: string, lang = 'txt') => {
    return (
      <SyntaxHighlighter key={makeHashFromSource(source)} showLineNumbers={true} language={lang} style={rainbow}>
        {source}
      </SyntaxHighlighter>
    )
  },
  image: (href: string, title: string, text: string) => {
    return (
      <div className='jamstic-image' key={href}>
        <Link href={href}>
          <img width={320} height={180} alt={title} src={href} />
        </Link>
        <div className='jamstic-image-title'>{text}</div>
      </div>
    )
  },
  link: (href: string, text: string) => {
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
          allowFullScreen: true,
          src: `//www.youtube.com/embed/${videoHash}`,
        }
        return (
          <VideoEmbedContainer key={videoHash}>
            <iframe {...iframeOptions} />
            <GameLink href={href} title={href} />
          </VideoEmbedContainer>
        )
      }
    }
    return <GameLink key={href + text} href={href} title={text} />
  },
  paragraph: (text: string) => {
    const textAsString = text.toString()
    const hash = makeHashFromSource(textAsString)
    return <ParagraphAsDiv key={hash}>{text}</ParagraphAsDiv>
  },
})
