const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const session = require('express-session')
const csurf = require('csurf')
const proxy = require('http-proxy-middleware')
const axios = require('axios')
const app = require('express')()
const RedisStore = require('connect-redis')(session);

const API_URI = process.env.API_URI || 'http://localhost:5000'

let config = require('./nuxt.config')
config.isDev = process.env.NODE_ENV !== 'production'

app.use(session({
  store: new RedisStore({

  }),
  secret: 'super-secret-key', // TBD: grab from env
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: !config.isDev, // require HTTPS in production
  }
}))

app.use(bodyParser.json())

app.use(csurf({ cookie: false }))

// we'll just check the csrf token from the cookie (same usage as Django)
// easier to use with Axios
app.use((req, res, next) => {
  res.cookie('csrf-token',  req.csrfToken())
  next()
})

app.use('/api', proxy({
  target: API_URI,
  changeOrigin: true,
  // logLevel: 'debug',
  onProxyReq(proxyReq, req, res) {
    console.log('proxy session', req.session)
    if (req.session.authToken) {
      proxyReq.setHeader('Authorization', 'Bearer ' + req.session.authToken)
    }
  },
  async onProxyRes(proxyRes, req, res) {
    // if the API returns a 401, the token can be considered invalid. Delete the token.
    if (proxyRes.statusCode === 401) {
      console.log('we have a 401, abort')
      delete req.session.user
      delete req.session.authToken
      await req.session.save()
    }
  }
}))

// these 2 views directly store the token / user to session.
// in a more realistic scenario, we would probably have another
// API call to fetch the user details and keep those out of the session,
// and maybe just flag if user is authenticated or not (if subsequent
// fetch returns a 40x we can just invalidate the token)
app.post('/auth/login/', async (req, res) => {
  try {
    const result = await axios.post(API_URI + '/login/', req.body)
    req.session.authToken = result.data.token
    req.session.user = { username: result.data.username, email: result.data.email }
    await req.session.save()
    return res.json(req.session.user)
  } catch (e) {
    console.log(e)
    return res.status(401).json({ error: 'Bad credentials' })
  }
})

app.post('/auth/logout/', async (req, res) => {
  delete req.session.user
  delete req.session.authToken
  await req.session.save()
  return res.status(200).json({ ok: true })
})

// instantiate Nuxt
// make sure we load all modules, plugins etc
const nuxt = new Nuxt(config)

if (config.isDev) {
  new Builder(nuxt).build()
}
app.use(nuxt.render)
app.listen(3000)
console.log('Server listening on port 3000')
