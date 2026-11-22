const {createServer} = require('node:http')
const {spawn} = require('node:child_process')
const assert = require('node:assert/strict')
let fail = false
const database = createServer((request, response) => {
  assert.match(request.url, /^\/rest\/v1\/services\?/)
  assert.ok(new URL(request.url, 'http://test').searchParams.get('status') === 'eq.approved')
  response.setHeader('Content-Type', 'application/json')
  response.statusCode = fail ? 500 : 200
  response.end(JSON.stringify(fail ? { message: 'Synthetic database error' } : [
    { id: 'demo-service', title: 'Demo residential cleaning', hourly_rate: 50, duration_minutes: 60, coverage_radius_miles: 10 }
  ]))
})
database.listen(3131, '127.0.0.1', async () => {
  const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3132'], {
    env: { ...process.env, SUPABASE_URL: 'http://127.0.0.1:3131', SUPABASE_PUBLISHABLE_KEY: 'synthetic-only' },
  })
  let logs = ''
  for (const stream of [app.stdout, app.stderr]) stream.on('data', chunk => logs += chunk)
  try {
    for (let i = 0; i < 50 && !logs.includes('Ready'); i++) await new Promise(resolve => setTimeout(resolve, 100))
    const get = path => fetch('http://127.0.0.1:3132' + path)
    const home = await get('/')
    assert.equal(home.status, 200)
    assert.match(await home.text(), /Sunny bungalow/)
    const asset = await get('/images/sunny-bungalow-384.webp')
    assert.equal(asset.status, 200)
    assert.match(asset.headers.get('content-type'), /^image\/webp/)
    const services = await get('/services')
    assert.equal(services.status, 200)
    assert.match(await services.text(), /Demo residential cleaning/)
    fail = true
    const api = await get('/api/services')
    assert.equal(api.status, 503)
    assert.deepEqual(await api.json(), { error: 'Service directory unavailable.' })
    assert.match(await (await get('/services')).text(), /The service directory is temporarily unavailable/)
    console.log('PASS: production listing and WebP, approved service from mock, injected database 500 maps to API 503 and UI unavailable state')
  } catch (error) {
    console.error(error, logs)
    process.exitCode = 1
  } finally {
    app.kill()
    database.close()
  }
})
