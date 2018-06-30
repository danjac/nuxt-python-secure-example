export default function ({ $axios }) {
  $axios.onRequest(config => {
    config.xsrfHeaderName = 'x-csrf-token'
    config.xsrfCookieName = 'csrf-token'
  })
}
