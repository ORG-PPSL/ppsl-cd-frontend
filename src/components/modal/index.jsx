import ReactDOM from 'react-dom'

/**
 * // https://www.learnbestcoding.com/post/45/reactjs-display-modal-portal
 * @param {{ children: ReactNode }} props
 */
export const RenderModal = (props) => {
  return globalThis.document
    ? ReactDOM.createPortal(
      props.children,
      globalThis.document?.getElementById('modal')
    )
    : null
}
