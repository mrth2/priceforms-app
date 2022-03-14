export default defineNuxtRouteMiddleware((to, from )=> {
  const isOnAdmin = to.path.includes('/admin');
  const isOnLogin = to.path.includes('/admin/login');
  if (isOnAdmin && !isOnLogin) {
    // check for user
    const subDomain = useSubDomain();
    console.log(subDomain);
    const user = useStrapiUser();
    console.log(user);
  }
});