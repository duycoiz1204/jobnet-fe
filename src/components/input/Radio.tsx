import { Input, InputProps } from '../ui/input';
import { Label } from '../ui/label';

interface RadioProps extends InputProps {
  label?: string;
}

export default function Radio({
  id,
  label,
  value,
  ...props
}: RadioProps): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      <Input className='h-4 w-4 border border-gray-300 focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:bg-emerald-600 dark:focus:ring-emerald-600 text-emerald-600' type="radio" value={value} id={id} {...props} />
      {label && <Label htmlFor={id}>{label}</Label>}
    </div>
  );
}
