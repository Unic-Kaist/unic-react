const backendAPIUrl = ` https://geralt_beta.unic.io`

export const getBackendEndpoint = (endpoint: string) => {
  return `${backendAPIUrl}/${endpoint}?API_KEY=${process.env.NEXT_PUBLIC_UNIC_BACKENED_API_KEY}`
}
