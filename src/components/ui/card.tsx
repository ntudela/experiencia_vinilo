import { ReactNode } from 'react';
export function Card({children, className='', ...props}: {children: ReactNode, className?: string} & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`border rounded-2xl bg-white ${className}`} {...props}>{children}</div>;
}
export function CardContent({children, className='', ...props}: {children: ReactNode, className?: string} & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
}
export default Card;
