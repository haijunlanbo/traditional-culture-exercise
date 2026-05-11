const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const PORT = 8899;
const DIR = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
};

const server = http.createServer((req, res) => {
  const filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`[SERVER] Running at http://localhost:${PORT}/`);

  console.log('[TUNNEL] Creating public tunnel via serveo.net...');

  const tunnel = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-o', 'ExitOnForwardFailure=yes',
    '-R', '80:localhost:' + PORT,
    'serveo.net'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  let resolved = false;

  tunnel.stderr.on('data', (data) => {
    const line = data.toString();
    process.stderr.write(line);
    if (!resolved) {
      const match = line.match(/(https?:\/\/[a-zA-Z0-9-]+\.serveousercontent\.com)/);
      if (match) {
        resolved = true;
        const publicUrl = match[1];
        onTunnelReady(publicUrl, tunnel);
      }
    }
  });

  tunnel.on('error', (err) => {
    console.error('[TUNNEL ERROR]', err.message);
    server.close();
    process.exit(1);
  });

  setTimeout(() => {
    if (!resolved) {
      console.error('[ERROR] Tunnel timeout - no URL received after 15s');
      tunnel.kill();
      server.close();
      process.exit(1);
    }
  }, 15000);
});

function onTunnelReady(publicUrl, tunnelProcess) {
  console.log(`[TUNNEL] Public URL: ${publicUrl}`);

  const qrPath = path.join(DIR, 'qrcode.png');
  QRCode.toFile(qrPath, publicUrl, {
    width: 500,
    margin: 3,
    color: { dark: '#8b1a1a', light: '#ffffff' },
    errorCorrectionLevel: 'H',
  }).then(() => {
    console.log(`[QR] Saved to ${qrPath}`);
    fs.writeFileSync(path.join(DIR, 'public-url.txt'), publicUrl);
    console.log(`[URL] Saved to public-url.txt`);
    console.log('\n========================================');
    console.log('  访问地址（扫码进入）: ' + publicUrl);
    console.log('  本地预览: http://localhost:' + PORT + '/');
    console.log('  二维码位置: ' + qrPath);
    console.log('  按 Ctrl+C 停止服务器和隧道');
    console.log('========================================\n');
  }).catch(err => {
    console.error('[ERROR]', err.message);
    tunnelProcess.kill();
    server.close();
    process.exit(1);
  });

  process.on('SIGINT', () => {
    tunnelProcess.kill();
    server.close();
    process.exit();
  });
}
