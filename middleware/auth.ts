import { Ref } from "nuxt3/dist/app/compat/capi";
import { IUser } from "~~/types/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isOnAdmin = to.path.includes('/admin');

  const { magicToken } = to.query;
  // if magicToken found, verify token and override current client login
  if (isOnAdmin && magicToken) {
    const formOwner = await useStrapiClient()<IUser>('/users/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${magicToken}`
      }
    });
    // form owner must be valid and own this form subdomain
    if (formOwner && formOwner.isOwner && formOwner.ownedForms.length && formOwner.ownedForms.includes(useSubDomain())) {
      useStrapiAuth().setToken(magicToken as string);
      if (typeof window !== 'undefined') {
        const cleanedUrl = to.fullPath.replace(new RegExp(`([\?\&])magicToken=${magicToken}`, 'g'), '$1');
        window.location.href = cleanedUrl;
      }
    }
  }

  const isOnAuth = to.path.includes('/admin/login') || to.path.includes('/admin/logout');
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
});