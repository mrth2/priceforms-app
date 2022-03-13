export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      strapiParser: (res: any, key?: string) => {
        const data = res.data;
        if (data) {
          if (key && data[key]) {
            return {
              id: data[key].data?.id,
              ...data[key].data?.attributes
            }
          }
          else {
            return {
              id: data.id,
              ...data.attributes
            }
          }
        }
        return null;
      }
    }
  }
});