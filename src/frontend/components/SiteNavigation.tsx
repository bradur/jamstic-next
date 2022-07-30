import Link from 'next/link'
import { Router } from 'next/router'
import styled from 'styled-components'

const SiteNavigationContainer = styled.nav`
  border-bottom: 1px solid #eee;
  font-weight: 300;
  padding: 0 1em;
  text-align: center;

  ul {
    margin: 0;
    padding: 0;
    max-width: 1280px;
    margin: auto;
    width: 100%;
    display: inline-block;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
    border-bottom: 5px solid transparent;
  }

  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 2px;
    background-color: #ccc;
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }

  .active-route {
    border-bottom-color: #ff3e00;
  }
`
type Props = {
  router: Router
}
const SiteNavigation = ({ router }: Props) => {
  const normalizedRoute = router.route.replaceAll('/[...slug]', '')
  const routes = [
    {
      href: '/blog',
      name: 'blog',
      title: 'blog',
    },
    {
      href: '/games',
      name: 'games',
      title: 'games',
    },
    {
      href: '/custom',
      name: 'custom',
      title: 'custom',
    },
  ]
  return (
    <SiteNavigationContainer>
      <ul>
        {routes.map((route) => (
          <li key={route.href} className={route.href === normalizedRoute ? 'active-route' : ''}>
            <Link href={route.href}>
              <a rel='prefetch'>{route.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </SiteNavigationContainer>
  )
}

export default SiteNavigation
