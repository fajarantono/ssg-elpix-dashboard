import { Main } from '@/types/main';

export interface Access extends Main {
  name: string;
  description?: string;
  isActive?: boolean;
}
export interface AddFormValues {
  name: string;
  description?: string | null;
}
export interface EditFormValues {
  name: string;
  description?: string | null;
  isActive: boolean;
}