import { Label } from '@/components/ui/label';
import { cn } from '@/libs/utils';

interface LabeledFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function LabeledField({ label, htmlFor, children, required, className }: LabeledFieldProps) {
  return (
    <div className={cn('grid grid-cols-3 items-center gap-4', className)}>
      <Label htmlFor={htmlFor} className="text-right text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}
