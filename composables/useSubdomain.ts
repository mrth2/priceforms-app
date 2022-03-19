export const useSubDomain = () => {
  try {
    // try to check for request header
    const headers = useRequestHeaders();
    let host: string;
    if (headers.host) {
      host = headers.host;
    }
    else {
      host = window.location.host;
    }
    const hostFragments = host.split('.')
    return hostFragments[1] ? hostFragments[0] : null
  } catch (error) {
    return null
  }
}