import { ReactNode } from 'react';
export function Button({children, className = '', ...props}: {children: ReactNode, className?: string} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`px-4 py-2 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 transition ${className}`} {...props}>{children}</button>;
}
export default Button;
