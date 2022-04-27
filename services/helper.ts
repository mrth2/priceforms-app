export const strapiParser = (res: any, key?: string) => {
  const data = res?.data;
  if (data) {
    if (key && data[key]) {
      return {
        id: parseInt(data[key]?.data?.id),
        ...data[key]?.data?.attributes
      }
    }
    else {
      return {
        id: parseInt(data.id),
        ...data.attributes
      }
    }
  }
  else if (res?.id) {
    return {
      id: parseInt(res.id),
      ...res.attributes
    }
  }
  return null;
};