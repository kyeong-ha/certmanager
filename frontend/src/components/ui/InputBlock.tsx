import React from 'react';
import { Input } from '@/components/ui/input';

interface InputBlockProps {
  label: string;
  name?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
  type?: string;
}

export default function InputBlock({
  label,
  name,
  value,
  onChange,
  editable = true,
  type = 'text',
}: InputBlockProps) {
  return (
    <label className="flex flex-col gap-1">
      <h3 className="text-sm font-bold">{label}</h3>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={!editable}
      />
    </label>
  );
}