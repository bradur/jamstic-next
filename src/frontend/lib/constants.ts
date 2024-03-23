import { getMarkedRenderer } from './markdownRenderer'

export const DEFAULT_MARKDOWN_OPTIONS = {
  breaks: true,
  renderer: getMarkedRenderer(),
}
