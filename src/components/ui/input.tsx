import { InputHTMLAttributes, forwardRef } from 'react';
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({className='', ...props}, ref) {
  return <input ref={ref} className={`border rounded-lg px-3 py-2 w-full ${className}`} {...props} />;
});
