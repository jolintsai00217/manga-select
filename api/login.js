const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  let body = '';
  await new Promise((resolve, reject) => {
    req.on('data', chunk => (body += chunk));
    req.on('end', resolve);
    req.on('error', reject);
  });

  const { password } = JSON.parse(body);
  const hash = crypto.createHash('sha256').update(password ?? '').digest('hex');

  if (hash === process.env.PASS_HASH) {
    const token = process.env.AUTH_TOKEN;
    res.setHeader(
      'Set-Cookie',
      `ms_auth=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/`
    );
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'wrong' });
  }
};
