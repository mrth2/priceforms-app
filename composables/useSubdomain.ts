export const useSubDomain = () => {
  try {
    const host = window.location.host
    const hostFragments = host.split('.')
    return hostFragments[1] ? hostFragments[0] : null
  } catch (error) {
    return null
  }
}