import React, { ReactNode } from 'react';
import './FooterStyles.css';
import Link from 'next/link';

interface FooterLinkProps {
  className?: string;
  children?: ReactNode;
  isTitle?: boolean;
  link?: string;
  newTarget: string;
}

function FooterLink({ children, isTitle, link, newTarget }: FooterLinkProps) {
  if (isTitle ?? false) {
    return <div className="footer-link-title">{children}</div>;
  }
  return (
    <Link href={link ?? '/'} target={newTarget} className="footer-link">
      {children}
    </Link>
  );
}

export default FooterLink;
