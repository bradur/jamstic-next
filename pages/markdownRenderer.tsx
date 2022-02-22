import Image from 'next/image'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { solarizedLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

export const getMarkedRenderer = () => {
  return {
    code: (source: string, lang = 'txt') => {
      return (
        <SyntaxHighlighter language={lang} style={solarizedLight}>
          {source}
        </SyntaxHighlighter>
      )
    },
    image: (href: string, title: string, text: string) => {
      return (
        <div className="jamstic-image">
          <a href={href}>
            <Image alt={title} src={href} />
          </a>
          <div className="jamstic-image-title">{text}</div>
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
          return <iframe {...iframeOptions} />
        }
      }
      return (
        <a href={href} title={title}>
          {text}
        </a>
      )
    },
  }
}
