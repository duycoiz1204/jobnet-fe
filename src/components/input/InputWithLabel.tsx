import React from 'react';
import { Label } from '../ui/label';
import { Input, InputProps } from '../ui/input';

interface Props extends InputProps {
  label: string;
}

function InputWithLabel({ id, label, type = 'text', ...props }: Props) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...props} />
    </div>
  );
}

export default InputWithLabel;
