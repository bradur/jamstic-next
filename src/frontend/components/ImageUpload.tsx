import { readImageToB64 } from 'backend/db/utils'
import React from 'react'

export const ImageUpload = ({ onUpload }: { onUpload: (imageAsB64: string, imageUrl: string) => void }) => {
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const b64Image = await readImageToB64(event.target.files[0])
      const fileName = event.target.files[0].name
      onUpload(b64Image, fileName)
    }
  }

  return (
    <div>
      <label htmlFor='imageUpload'>Choose an image:</label>
      <input type='file' id='imageUpload' accept='.jpg,.jpeg,.png,.gif' onChange={handleImageChange} />
    </div>
  )
}
