import styled from 'styled-components'

export const FilterInfoContainer = styled.div`
  background: cyan;
  color: white;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 5px 15px;

  display: flex;

  max-width: 256px;
  box-sizing: border-box;

  @media screen and (max-width: 720px) {
    margin: auto;
    justify-content: center;
    align-items: center;
  }
`
