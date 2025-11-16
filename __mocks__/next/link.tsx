import React from 'react';
import type { LinkProps } from 'next/link';

type AnchorLikeProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps & AnchorLikeProps>(
  ({ href, children, prefetch: _prefetch, ...rest }, ref) => (
    <a
      ref={ref}
      href={href === undefined ? undefined : typeof href === 'string' ? href : String(href)}
      {...rest}
    >
      {children}
    </a>
  ),
);

Link.displayName = 'NextLinkMock';

export default Link;
