import { MarkdownOptions } from 'marked-react'
import { getMarkedRenderer } from './markdownRenderer'

export const DEFAULT_MARKDOWN_OPTIONS: MarkdownOptions = {
  breaks: true,
  renderer: getMarkedRenderer(),
}
