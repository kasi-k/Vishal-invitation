// Text that writes itself on.
//
// A soft-edged gradient mask, twice the width of the element, slides across it.
// The soft edge is what sells it: a hard clip reads as a wipe, a feathered one
// reads as ink arriving.
export default function Script({ as: Tag = 'span', children, className = '', delay = 0, style }) {
  return (
    <Tag className={`write ${className}`} style={{ '--wd': `${delay}s`, ...style }}>
      {children}
    </Tag>
  );
}
