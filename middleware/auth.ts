import { Ref } from "nuxt3/dist/app/compat/capi";
import { IUser } from "~~/types/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const isOnAdmin = to.path.includes('/admin');
  const isOnAuth = to.path.includes('/admin/login') || to.path.includes('/admin/logout');
  const isOnSignUp = to.path === '/signup';
  const user = useStrapiUser() as Ref<IUser>;
  if (isOnAdmin && !isOnAuth) {
    // check for user
    const subDomain = useSubDomain();
    if (!user.value) {
      const authRef = useCookie('auth-ref', { path: '/' });
      authRef.value = to.path.toString();
      return navigateTo('/admin/login');
    }
    else if (
      !user.value.isOwner ||
      !user.value.ownedForms.length ||
      !user.value.ownedForms.includes(subDomain)
    ) {
      return navigateTo('/');
    }
  }
  // if normal user trying to access signup page but already logged in, direct to /cases page
  else if (isOnSignUp) {
    // if (user.value) {
    //   return navigateTo('/cases');
    // }
  }
});