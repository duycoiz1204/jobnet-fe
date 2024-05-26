import { Checkbox as CheckBoxCpn } from '@/components/ui/checkbox';

enum Color {
  emerald = 'h-4 w-4 rounded border border-emerald-300 bg-emerald-100 focus:ring-2 focus:ring-emerald-500 text-emerald-600',
  default = 'h-4 w-4 rounded border border-dark-300 bg-transparent focus:ring-2 focus:ring-emerald-500 text-emerald-600',
}

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  color?: string;
}

const Checkbox = ({ color = 'emerald', ...props }: CheckboxProps) => {
  const base = SelectColor(color);

  return <CheckBoxCpn className={base} />;
};
function SelectColor(key: string): Color {
  if (key === 'emerald') return Color.emerald;
  return Color.default;
}

export default Checkbox;
