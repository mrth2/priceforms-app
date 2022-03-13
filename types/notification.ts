import { FunctionalComponent } from "vue";

export interface INotification {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  icon?: FunctionalComponent
  duration?: number
  expireAt?: number
}