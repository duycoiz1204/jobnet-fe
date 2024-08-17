import React from 'react';
import { Label } from '../ui/label';
import { Input, InputProps } from '../ui/input';
import { cn } from '@/lib/utils';

interface Props extends InputProps {
  label: string;
}

function InputWithLabel({
  id,
  label,
  type = 'text',
  className,
  ...props
}: Props) {
  return (
    <div className={cn('grid w-full items-center gap-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...props} />
    </div>
  );
}

export default InputWithLabel;
