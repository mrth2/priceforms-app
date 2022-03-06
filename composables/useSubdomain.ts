export default function () {
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.host.split('.')
    return host[1] ? host[0] : null
  }
  return null
}