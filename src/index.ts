import { Hono } from 'hono';
import { cors } from 'hono/cors';
import exampleRouter from './routes/example.route';


const app = new Hono();

app.use(
	'/*',
	cors({
		origin: '*',
	})
);

app.get('/', (c: any) => {
	return c.text('Welcome to Example API');
})

app.route('/api/example', exampleRouter);

app.onError((err: any, c: any) => {
	return c.json({ success: false, message: err.message }, err.status);
});

export default app;