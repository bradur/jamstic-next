// matches markdown image syntax: [title](url)
const markdDownImageRegex = /!\[.*?\]\(.*?\)/g

const findImageUrls = (text: string) => {
  const matches = [...text.matchAll(markdDownImageRegex)]
  return matches.map((match) => {
    const [mdUrl] = match
    const [title, urlString] = mdUrl.split('](')
    const [url] = urlString.split(')')
    return url
  })
}

export { findImageUrls }
