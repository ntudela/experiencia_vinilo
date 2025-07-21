import { ReactNode } from 'react';
export function Badge({children, variant='secondary', className='', ...props}: {children: ReactNode, variant?: 'default'|'secondary', className?: string} & React.HTMLAttributes<HTMLSpanElement>) {
  const styles = variant==='default' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800';
  return <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${styles} ${className}`} {...props}>{children}</span>;
}
