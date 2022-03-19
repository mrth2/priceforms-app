import { FunctionalComponent } from "vue";

export interface INotification {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  position?: 'center' | 'right';
  message?: string;
  icon?: FunctionalComponent
  duration?: number
  expireAt?: number
}