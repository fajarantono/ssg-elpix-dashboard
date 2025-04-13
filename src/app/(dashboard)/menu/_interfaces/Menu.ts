import { Main } from '@/types/main';

export interface Menu extends Main {
  name: string;
  alias: string;
  sequenceNo: number;
  icon: string;
  url?: string;
  parentId?: string;
  isActive?: boolean;
}
export interface AddFormValues {
  name: string;
  alias: string;
  sequenceNo: number;
  icon: string;
  url: string;
  parentId?: string | null;
}
export interface EditFormValues {
  name: string;
  alias: string;
  sequenceNo: number;
  icon: string;
  url: string;
  parentId?: string | null;
  isActive: boolean;
}
