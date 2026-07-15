const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const rootDir = __dirname;
const publicDir = path.join(rootDir, 'public');

function calculateAnalysis(values = {}) {
  const coherence = Number(values.coherence || 0.82);
  const resilience = Number(values.resilience || 0.74);
  const consent = Number(values.consent || 0.79);
  const transparency = Number(values.transparency || 0.88);

  const effectiveness = Number((coherence * 3.2 + resilience * 2.8 + consent * 2.1 + transparency * 1.9).toFixed(2));
  const compliance = Math.min(100, Math.round((coherence * 0.3 + resilience * 0.25 + consent * 0.25 + transparency * 0.2) * 100));
  const recursionGain = Number((effectiveness / 10 + 0.12).toFixed(2));
  const selfApplication = Math.min(100, Math.round((effectiveness / 10) * 100));

  const recommendation = effectiveness >= 7.5
    ? 'Self-reinforcing adaptation is active and the system is converging toward stable recursive alignment.'
    : effectiveness >= 6.5
      ? 'The framework is responsive, but additional resonance or constraint translation would improve coherence.'
      : 'The architecture needs stronger consent, transparency, or resilience to reach a durable recursive threshold.';

  return {
    effectiveness,
    compliance,
    recursionGain,
    selfApplication,
    recommendation
  };
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/metrics') {
    sendJson(res, 200, {
      version: '2.1',
      frameworkEffectiveness: 7.09,
      complianceRate: 92,
      wheelReinventionsPrevented: 3,
      constraintInformationGain: 0.85,
      selfApplicationSuccess: 95
    });
    return;
  }

  if (req.url.startsWith('/api/analyze')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const values = Object.fromEntries(url.searchParams.entries());
    sendJson(res, 200, calculateAnalysis(values));
    return;
  }

  let requestedPath = req.url === '/' ? '/index.html' : req.url;
  if (requestedPath === '/white-mirror-dashboard' || requestedPath === '/white-mirror-dashboard/') {
    requestedPath = '/index.html';
  }
  const filePath = path.normalize(path.join(publicDir, requestedPath));

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server error');
      }
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

if (require.main === module) {
  server.listen(port, () => {
    console.log(`White Mirror dashboard available at http://localhost:${port}`);
  });
}

module.exports = {
  calculateAnalysis
};
