import { Label } from '../ui/label';
import { TextareaProps as RawTextareaProps, Textarea } from '../ui/textarea';

interface TextareaProps extends RawTextareaProps {
  label?: string;
}

function TextareaWithLabel({
  id,
  label,
  color = 'green',
  ...props
}: TextareaProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Textarea id={id} color={color} {...props} />
    </div>
  );
}

export default TextareaWithLabel;
