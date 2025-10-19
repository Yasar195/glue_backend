import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { auth } from './auth/auth';
import { knowledge } from './knowledge/knowledge';

const app = new Hono();
app.route('/auth', auth);
app.route('/kb', knowledge);

app.get('/', (c) => {
  return c.text('Hello Yasar!')
})

app.get('/v2', (c) => {
  return c.text('Hello Yasar v2!')
})

export const handler = handle(app)