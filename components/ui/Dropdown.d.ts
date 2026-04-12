import { FC } from 'react';

interface Option {
  label: string;
  value: any;
}

interface DropdownProps {
  options: Option[];
  placeholder?: string;
  onChange?: (option: Option) => void;
  className?: string;
  value?: any;
}

declare const CustomDropdown: FC<DropdownProps>;

export default CustomDropdown;
