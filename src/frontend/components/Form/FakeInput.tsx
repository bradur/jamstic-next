import { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react'
import styled from 'styled-components'
import { BaseInputStyle } from './baseComponents'

const FakeInputContainer = styled.label`
  ${BaseInputStyle}

  input {
    ${BaseInputStyle}
    padding:0;
    border-radius: 0;
    background: transparent;
    border: 0;
    width: 100%;
    height: 100%;
  }
`

export const FakeInput = (props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
  const { onChange, ...propsWithoutOnChange } = props
  const [value, setValue] = useState<string>('')
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event)
    }
    setValue(event.target.value)
  }
  return (
    <FakeInputContainer>
      <input {...propsWithoutOnChange} onChange={handleOnChange} value={value} />
    </FakeInputContainer>
  )
}
