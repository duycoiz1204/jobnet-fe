import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { text: string; value: string }[];
  color?: string;
  label?: string;
  labelConfig?: string;
}

const SelectWithLabel = ({
  color = 'default',
  options = [],
  id = '',
  label,
  labelConfig = '',
  ...props
}: SelectProps) => {
  return (
    <div>
      {label && (
        <Label
          htmlFor={id}
          className={'block mb-2 font-normal text-[16px] ' + labelConfig}
        >
          {label}
        </Label>
      )}
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectWithLabel;
