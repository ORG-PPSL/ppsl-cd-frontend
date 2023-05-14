import { usePageContext } from './usePageContext'

/**
 * @returns {React.FC<React.HTMLProps<HTMLAnchorElement>>}
 */
export function Link (props) {
  const pageContext = usePageContext()
  const className = [
    props.className,
    pageContext.urlPathname === props.href && 'is-active'
  ]
    .filter(Boolean)
    .join(' ')

  return <a {...props} className={className} />
}
