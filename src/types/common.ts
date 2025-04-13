export interface ColumnProps<T> {
  title: string;
  key: keyof T;
  inlineSize?: number;
  align?: 'left' | 'center' | 'right';
  render?: (data: T) => React.ReactNode;
}

export interface AddModalsProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
}

export interface EditModalsProps<T extends object> {
  title: string;
  initValues: T;
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
}