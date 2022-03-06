export const useSubDomain = () => {
  const host = window.location.host
  const hostFragments = host.split('.')
  return hostFragments[1] ? hostFragments[0] : null
}