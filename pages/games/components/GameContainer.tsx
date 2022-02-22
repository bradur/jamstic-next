import styled from 'styled-components'

export const GameContainer = styled.div`
  position: relative;
  max-width: 920px;
  margin: 0 auto;

  @media (max-width: 1350px) {
    margin-left: 240px;
  }

  .game-content {
    background: #f9f9f9;
    padding: 5px 20px;
    padding-bottom: 20px;
  }

  .game-content h2 {
    font-size: 1.4em;
    font-weight: 500;
  }

  .game-content ul {
    line-height: 1.5;
  }

  .game-content li {
    margin: 0 0 0.5em 0;
  }

  .game-content img {
    max-width: 100%;
  }

  .game-content th,
  .game-content td {
    text-align: left;
    padding: 5px;
  }

  .game-content table {
    border-spacing: 0;
    border: 1px solid #ccc;
  }

  .game-content th {
    font-size: 16px;
    font-weight: bold;
    color: #444;
    background: #eee;
  }

  .game-content tr:nth-child(even) {
    background: #f9f9f9;
  }

  .game-content tr:nth-child(odd) {
    background: #fff;
  }

  jamstic-image {
    background: #fff;
    display: inline-block;
    border: 1px solid #ccc;
    padding: 5px;
  }

  jamstic-image-title {
    padding: 0 5px;
  }
`
