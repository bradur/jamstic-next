import styled from 'styled-components'

export const EntriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 256px);
  grid-auto-rows: 256px;
  grid-gap: 10px;
  justify-content: flex-start;
  @media screen and (max-width: 720px) {
    justify-content: center;
  }
`
