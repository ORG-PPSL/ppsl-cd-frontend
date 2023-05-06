export function Button ({ children, className = '', ...restProps }) {
  return (
    <button
      type={restProps.type || 'button'}
      className={`m-0 w-[unset] text-black dark:text-white ${className}`}
      {...restProps}
    >
      {children}
    </button>
  )
}
