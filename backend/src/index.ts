import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

app.get('/', (c) => c.text('Khee Backend API'));

// Get all rooms
app.get('/api/rooms', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM rooms ORDER BY created_at DESC').all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Add room
app.post('/api/rooms', async (c) => {
  try {
    const body = await c.req.json();
    const { title, description, type, address, lat, lng, rating, price, user_id, username } = body;
    
    const stmt = c.env.DB.prepare(
      'INSERT INTO rooms (title, description, type, address, lat, lng, rating, price, user_id, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    
    const info = await stmt.bind(title, description, type, address, lat, lng, rating, price, user_id, username).run();
    
    // Get the created room
    const room = await c.env.DB.prepare('SELECT * FROM rooms WHERE id = ?').bind(info.meta.last_row_id).first();
    
    return c.json(room);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Register
app.post('/api/register', async (c) => {
  try {
    const { username, email, password, bio } = await c.req.json();
    
    // Check if exists
    const existing = await c.env.DB.prepare('SELECT * FROM users WHERE email = ? OR username = ?').bind(email, username).first();
    if (existing) {
      return c.json({ error: 'Username or Email already exists' }, 400);
    }
    
    const stmt = c.env.DB.prepare(
      'INSERT INTO users (username, email, password, bio) VALUES (?, ?, ?, ?)'
    );
    
    const info = await stmt.bind(username, email, password, bio).run();
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(info.meta.last_row_id).first();
    
    return c.json(user);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Login
app.post('/api/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ? AND password = ?').bind(email, password).first();
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    return c.json(user);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Update Profile
app.put('/api/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { username, email, bio, password } = await c.req.json();
    
    let query = 'UPDATE users SET username = ?, email = ?, bio = ?';
    const params = [username, email, bio];
    
    if (password) {
      query += ', password = ?';
      params.push(password);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    await c.env.DB.prepare(query).bind(...params).run();
    
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    return c.json(user);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;
