import { colorsFromB64 } from '@lib/coverColors'
import { readImageToB64 } from 'backend/db/utils'
import React, { useState } from 'react'
import styled from 'styled-components'
import { EntryColorPalette } from 'types/types-custom'
import { ButtonyLabel } from './Form/baseComponents'

const ImageUploadContainer = styled.div`
  input {
    display: none;
  }
`

const ImagePreviewContainer = styled.div`
  border:1px solid #ccc;
  border-bottom:0;
  padding:5px;
  height:200px
`

const FileName = styled.span`
  padding: 5px;
`

const PreviewImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  display:block;

  &:hover {
    object-fit:contain;
  }
`
const PreviewImageInfo = styled.div`
  position:absolute;
  bottom:0;
  width:100%;
  text-align:center;
  background: rgba(0, 0, 0, 46%);
  color:#fff;
`

const PreviewImageContainer = styled.div`
  position:relative;
  height:100%;
`


const ButtonLabel = styled(ButtonyLabel)`
  font-size:20px;
  height:40px;
  line-height: normal;
  width:100%;
  margin:0;
`

const ColorPalette = styled.div<{ coverColors: string }>`
  ${(props) => props.coverColors}

  padding-bottom:6px;
  display:flex;
  width:auto;
  justify-content: center;

  .game-palette {
    display:flex;
    flex-direction:column;
    margin:4px;
    margin-bottom:0;
  }

  .game-palette-color {
    display: inline-block;
    margin: auto;
    height: 20px;
    width: 40px;
    border:1px solid #fff;
    box-sizing:border-box;
  }

  .game-palette-one .game-palette-color {
    background: var(--one);
  }
  .game-palette-two  .game-palette-color {
    background: var(--two);
  }
  .game-palette-three  .game-palette-color {
    background: var(--three);
  }
  .game-palette-four  .game-palette-color {
    background: var(--four);
  }
  .game-palette-five  .game-palette-color {
    background: var(--five);
  }

  .game-palette-hex-string {
    font-size:8px;
    color:#fff;
    display:inline-block;
    background:#000;
    font-family:monospace;
    text-align:center;
  }
`


export type OnImageUploadProps = {
  coverColors: EntryColorPalette
  imageAsB64: string
  imageUrl: string
}

type Props = {
  onUpload: (props: OnImageUploadProps) => void
}

export const ImageUpload = ({ onUpload }: Props) => {
  const [filename, setFilename] = useState<string>('')
  const [imageAsB64, setImageAsB64] = useState<string>('')
  const [colorPalette, setColorPalette] = useState<EntryColorPalette>({ colors: [], css: '' })
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const b64Image = await readImageToB64(event.target.files[0])
      const imageFilename = event.target.files[0].name
      const coverColors = await colorsFromB64({ imageAsB64: b64Image });
      setFilename(imageFilename)
      setImageAsB64(b64Image)
      setColorPalette(coverColors)
      onUpload({ imageAsB64: b64Image, coverColors, imageUrl: imageFilename })
    }
  }

  return (
    <ImageUploadContainer>

      <ImagePreviewContainer>
        {imageAsB64 !== '' ? (
          <PreviewImageContainer>
            <PreviewImage src={imageAsB64} />
            <PreviewImageInfo>
              <FileName>{filename}</FileName>
              <ColorPalette coverColors={colorPalette.css}>
                {colorPalette.colors.map(({ name, hex }) => (
                  <div className={`game-palette game-palette-${name}`}>
                    <div className='game-palette-color'></div>
                    <div className='game-palette-hex-string'>{hex}</div>
                  </div>
                ))}
              </ColorPalette>
            </PreviewImageInfo>
          </PreviewImageContainer>
        ) : (
          <span>image preview will be here</span>
        )}
      </ImagePreviewContainer>
      <ButtonLabel htmlFor='imageUpload'>Choose an image</ButtonLabel>
      <input type='file' id='imageUpload' accept='.jpg,.jpeg,.png,.gif' onChange={handleImageChange} />
    </ImageUploadContainer>
  )
}
