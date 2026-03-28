export const config = {
  matcher: ['/collection.html'],
};

export default function middleware(req) {
  const cookie = req.headers.get('cookie') ?? '';
  const token = cookie.split(';').reduce((acc, c) => {
    const [k, v] = c.trim().split('=');
    return k === 'ms_auth' ? v : acc;
  }, null);

  if (token && token === process.env.AUTH_TOKEN) {
    return; // pass through
  }

  return Response.redirect(new URL('/login.html', req.url), 302);
}
