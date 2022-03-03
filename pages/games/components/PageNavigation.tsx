import styled from 'styled-components'

const PageBreadcrumbContainer = styled.div`
  max-width: 920px;
  margin: 0 auto;
  .breadcrumb-back {
    font-size: 20px;
    display: inline-block;
    padding: 5px;
    background: #fff;
    border: 5px solid #eee;
    margin: 10px 0;
    line-height: 16px;
    height: 20px;
  }
`

type PageBreadcrumbProps = {
  route: string
  title?: string
}

export const PageBreadcrumb = ({ route, title = 'back' }: PageBreadcrumbProps) => {
  return (
    <PageBreadcrumbContainer>
      <a className='breadcrumb-back' href={`/${route}`}>
        &lt;- {title}
      </a>
    </PageBreadcrumbContainer>
  )
}
