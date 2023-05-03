export const readImageIntoUint8Array = async (image: File): Promise<Uint8Array> => {
  const reader = new FileReader()
  reader.readAsArrayBuffer(image)
  return new Promise((resolve) => {
    reader.onload = () => {
      const data = new Uint8Array(reader.result as ArrayBuffer)
      resolve(data)
    }
  })
}

export const readImageToB64 = async (image: File): Promise<string> => {
  const reader = new FileReader()
  reader.readAsDataURL(image)
  return new Promise<string>((resolve) => {
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(';base64,')[1])
    }
  })
}
