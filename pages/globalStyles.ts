import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;  
}

h1, h2, h3, h4, h5, h6 {
  margin: 1rem 0;
  font-weight: 700;
  line-height: 1.5em;
}

h1 {
  font-size: 2em;
}

h2 {
  font-size: 1.5em;
}

a {
  color: inherit;
  color:#ff3e00;
  text-decoration:none;
}

code {
  font-family: menlo, inconsolata, monospace;
  font-size: calc(1em - 2px);
  color: #555;
  background-color: #f0f0f0;
  padding: 0.2em 0.4em;
  border-radius: 2px;
}

@media (min-width: 400px) {
  body {
      font-size: 16px;
  }
}
`

export default GlobalStyle
