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
      <Input type="radio" value={value} id={id} {...props} />
      {label && <Label htmlFor={id}>{label}</Label>}
    </div>
  );
}
