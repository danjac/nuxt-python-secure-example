export default function ({ $axios, redirect }) {
  $axios.onRequest(config => {
    config.xsrfHeaderName = 'x-csrf-token'
    config.xsrfCookieName = 'csrf-token'
  })
  $axios.onError(error => {
    const code = error.response && error.response.status
    if ([401, 403].includes(code)) {
      redirect('/login')
    }
  })
}
