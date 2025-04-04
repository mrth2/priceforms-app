import { ISubscriber } from '~~/types/subscriber';
import { IUser } from '~~/types/user'
export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      fullname: (user: IUser | ISubscriber) => {
        if (!user) return '';
        if (user['fullName']) {
          return user['fullName'];
        }
        if (user['firstName'] && user['lastName']) {
          return user['firstName'] + ' ' + user['lastName'];
        }
        if (user['firstName']) {
          return user['firstName']
        }
        if (user['lastName']) {
          return user['lastName']
        }
        if (user['username']) {
          return user['username']
        }
        return user.email
      }
    }
  }
})