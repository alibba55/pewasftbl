const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors({
  origin: [
    'https://pewasftbl.online',
    'http://127.0.0.1:8000',
    'http://localhost:8000'
  ]
}));
app.use(bodyParser.json());

// Veritabanı bağlantısı
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err.message);
  } else {
    console.log('SQLite veritabanına bağlanıldı.');
  }
});

// Tablo oluşturma
const userTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  abonelik_durumu TEXT DEFAULT 'beklemede',
  abonelik_baslangic TEXT,
  abonelik_bitis TEXT
);`;

const abonelikTable = `CREATE TABLE IF NOT EXISTS abonelik_basvurulari (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  basvuru_tarihi TEXT,
  durum TEXT DEFAULT 'beklemede',
  FOREIGN KEY(user_id) REFERENCES users(id)
);`;

db.run(userTable);
db.run(abonelikTable);

// Kullanıcı tablosuna email ve phone ekle (varsa atla)
db.run('ALTER TABLE users ADD COLUMN email TEXT', () => {});
db.run('ALTER TABLE users ADD COLUMN phone TEXT', () => {});

// API: Kullanıcı abone olunca başvuru ekle
app.post('/api/abonelik-basvur', (req, res) => {
  const { username } = req.body;
  db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Kullanıcı bulunamadı.' });
    const now = new Date().toISOString();
    db.run('INSERT INTO abonelik_basvurulari (user_id, basvuru_tarihi) VALUES (?, ?)', [user.id, now], function(err) {
      if (err) return res.status(500).json({ error: 'Başvuru eklenemedi.' });
      res.json({ success: true });
    });
  });
});

// API: Admin - bekleyen başvuruları listele
app.get('/api/bekleyen-basvurular', (req, res) => {
  db.all(`SELECT a.id, u.username, a.basvuru_tarihi FROM abonelik_basvurulari a JOIN users u ON a.user_id = u.id WHERE a.durum = 'beklemede'`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Veri alınamadı.' });
    res.json(rows);
  });
});

// API: Admin - başvuruyu onayla
app.post('/api/basvuru-onayla', (req, res) => {
  const { id } = req.body;
  const bitis = new Date();
  bitis.setMonth(bitis.getMonth() + 1);
  const bitisStr = bitis.toISOString();
  db.get('SELECT user_id FROM abonelik_basvurulari WHERE id = ?', [id], (err, row) => {
    if (err || !row) return res.status(400).json({ error: 'Başvuru bulunamadı.' });
    db.run('UPDATE abonelik_basvurulari SET durum = ? WHERE id = ?', ['onaylı', id]);
    db.run('UPDATE users SET abonelik_durumu = ?, abonelik_baslangic = ?, abonelik_bitis = ? WHERE id = ?', ['onaylı', new Date().toISOString(), bitisStr, row.user_id]);
    res.json({ success: true });
  });
});

// API: Admin - başvuruyu reddet
app.post('/api/basvuru-reddet', (req, res) => {
  const { id } = req.body;
  db.get('SELECT user_id FROM abonelik_basvurulari WHERE id = ?', [id], (err, row) => {
    if (err || !row) return res.status(400).json({ error: 'Başvuru bulunamadı.' });
    db.run('UPDATE abonelik_basvurulari SET durum = ? WHERE id = ?', ['reddedildi', id]);
    db.run('UPDATE users SET abonelik_durumu = ?, abonelik_baslangic = NULL, abonelik_bitis = NULL WHERE id = ?', ['reddedildi', row.user_id]);
    res.json({ success: true });
  });
});

// API: Kullanıcı profili için abonelik durumu
app.get('/api/kullanici/:username', (req, res) => {
  const { username } = req.params;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    res.json(row);
  });
});

// Kullanıcı kayıt (güncellenmiş)
app.post('/api/register', (req, res) => {
  const { username, password, email, phone } = req.body;
  if (!username || !password || !email || !phone) return res.status(400).json({ error: 'Tüm alanlar zorunlu.' });
  db.run('INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)', [username, password, email, phone], function(err) {
    if (err) return res.status(400).json({ error: 'Kullanıcı adı veya e-posta zaten kullanılıyor.' });
    res.json({ success: true });
  });
});

// Kullanıcı giriş
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre.' });
    res.json({ success: true, username: user.username });
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
}); 
