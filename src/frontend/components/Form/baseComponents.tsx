import styled, { css } from 'styled-components'

export const BaseButtonLike = css`
  color: orange;
  font-weight: bold;
  background: transparent;
  border: 1px solid orange;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  margin: 5px 0;
  display: inline-block;
  box-sizing:border-box;

  &:hover {
    background: rgba(255, 152, 0, 0.24);
    color: black;
  }
`

export const ButtonyLabel = styled.label`
  ${BaseButtonLike}
`

export const BaseLabel = styled.label`
  display: block;
  color: #ccc;
  margin: 20px 0;
`

export const BaseButton = styled.button`
  ${BaseButtonLike}

  &:disabled {
    border-color: #ccc;
    color: #ccc;
  }

  &:disabled:hover {
    background: transparent;
    cursor: default;
  }
`

export const BaseGrid = styled.div<{ cellWidth: number; cellHeight: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, ${({ cellWidth }) => cellWidth}px);
  grid-auto-rows: ${({ cellHeight }) => cellHeight};
  grid-auto-columns: ${({ cellWidth }) => cellWidth};
  grid-gap: 10px;
`

export const BaseInputStyle = css`
  display: inline-block;
  margin: 0;
  background: #f9f9f9;
  border-radius: 5px;
  font-size: 20px;
  line-height: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  font-weight: normal;
`

export const BaseInput = styled.input`
  ${BaseInputStyle}
`

export const BaseTextarea = styled.textarea`
  margin: 0;
  background: #f9f9f9;
  border-radius: 5px;
  font-size: 20px;
  line-height: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    font-weight: normal;
    font-style: italic;
  }
`

export const BaseTagLike = css`
  display: inline-block;
  margin: auto;
  margin-top: 5px;
  margin-right: 5px;
  padding: 0 5px;
  border-radius: 3px;
  background: white;
  border: 1px solid #ccc;
  position: relative;
  height: 20px;
  line-height: 20px;
`

export const BaseTag = styled.div`
  ${BaseTagLike}
`
