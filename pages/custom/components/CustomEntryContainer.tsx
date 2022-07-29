import styled from 'styled-components'

export const CustomEntryContainer = styled.div`
  position: relative;
  max-width: 920px;
  margin: 0 auto;

  @media (max-width: 1350px) {
    margin-left: 240px;
  }

  .custom-entry-content {
    background: #f9f9f9;
    padding: 5px 20px;
    padding-bottom: 20px;
  }

  .custom-entry-content h2 {
    font-size: 1.4em;
    font-weight: 500;
  }

  .custom-entry-content ul {
    line-height: 1.5;
  }

  .custom-entry-content li {
    margin: 0 0 0.5em 0;
  }

  .custom-entry-content img {
    max-width: 100%;
  }

  .custom-entry-content th,
  .custom-entry-content td {
    text-align: left;
    padding: 5px;
  }

  .custom-entry-content table {
    border-spacing: 0;
    border: 1px solid #ccc;
  }

  .custom-entry-content th {
    font-size: 16px;
    font-weight: bold;
    color: #444;
    background: #eee;
  }

  .custom-entry-content tr:nth-child(even) {
    background: #f9f9f9;
  }

  .custom-entry-content tr:nth-child(odd) {
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
