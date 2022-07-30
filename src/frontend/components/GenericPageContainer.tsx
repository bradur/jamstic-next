import styled from 'styled-components'

export const GenericPageContainer = styled.div`
  margin: 0 auto;
  padding-bottom: 100px;
  width: 1280px;

  @media screen and (max-width: 1920px) {
    width: 1080px;
  }

  @media screen and (max-width: 1280px) {
    width: 960px;
  }

  @media screen and (max-width: 1024px) {
    width: 720px;
  }

  @media screen and (max-width: 960px) {
    width: 540px;
  }

  @media screen and (max-width: 720px) {
    width: auto;
    max-width: 100%;
  }
`
