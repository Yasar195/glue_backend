import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { auth } from './auth/auth'

const app = new Hono();
app.route('/auth', auth);

app.get('/', (c) => {
  return c.text('Hello Yasar!')
})

export const handler = handle(app)