import { readImageToB64 } from 'backend/db/utils'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { ButtonyLabel } from './Form/baseComponents'

const ImageUploadContainer = styled.div`
  input {
    display: none;
  }
`
const FileName = styled.span`
  padding: 5px;
`

const ImageStyle = css`
  width: auto;
  mad-width: 500px;
  height: 100px;
`
const PreviewImage = styled.img`
  ${ImageStyle}
`

const PreviewImageContainer = styled.div`
  ${ImageStyle}
`

export const ImageUpload = ({ onUpload }: { onUpload: (imageAsB64: string, imageUrl: string) => void }) => {
  const [filename, setFilename] = useState<string>('')
  const [imageAsB64, setImageAsB64] = useState<string>('')
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const b64Image = await readImageToB64(event.target.files[0])
      const imageFilename = event.target.files[0].name
      setFilename(imageFilename)
      setImageAsB64(b64Image)
      onUpload(b64Image, imageFilename)
    }
  }

  return (
    <ImageUploadContainer>
      {imageAsB64 !== '' && (
        <PreviewImageContainer>
          <PreviewImage src={imageAsB64} />
        </PreviewImageContainer>
      )}
      <ButtonyLabel htmlFor='imageUpload'>Choose an image</ButtonyLabel>
      <FileName>{filename}</FileName>
      <input type='file' id='imageUpload' accept='.jpg,.jpeg,.png,.gif' onChange={handleImageChange} />
    </ImageUploadContainer>
  )
}
