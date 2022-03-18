import { defineStore } from 'pinia';
import { INotification } from '~~/types/notification';

export const useAppStore = defineStore('app', {
  state: () => ({
    pageTitle: null,
    isLoading: false,
    notifications: [] as Array<INotification>,
    currentProgress: {
      label: '',
      value: 0,
    },
  }),
  actions: {
    setPageTitle(title: string) {
      this.pageTitle = title;
    },
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },
    pushNotification(notification: INotification) {
      const duration = notification.duration || 5000;
      const newLength = this.notifications.push({
        ...notification,
        expireAt: new Date().getTime() + duration
      });
      // after the duration, filter out expired notifications
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.expireAt > new Date().getTime());
      }, duration);
    },
    removeNotification(index: number) {
      this.notifications.splice(index, 1);
    },
    clearNotifications() {
      this.notifications = [];
    },
    setCurrentProgress(progress: { label: string, value: number }) {
      this.currentProgress = progress;
    }
  }
});