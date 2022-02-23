const urlRegex = /(\(\/\/\/.*?\))/g // matches start: '(///' end: ')'
const formats = ['.png)', '.jpg)', '.gif)']

const cleanUpUrl = (url: string) => url.replace(/\(\/\/\//g, '').replace(/\)/g, '')

const findImageUrls = (imageUrl: string) => {
  let urls = imageUrl.match(urlRegex)
  if (urls !== null) {
    urls = urls.filter((match) => {
      return formats.some((format) => match.toLowerCase().endsWith(format))
    })
  } else {
    urls = []
  }
  return urls
}

const getCleanUrls = (rawUrl: string) => findImageUrls(rawUrl).map((url: string) => cleanUpUrl(url))

export { findImageUrls, getCleanUrls }
