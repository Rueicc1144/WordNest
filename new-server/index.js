const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// 資料庫初始化
const db = new sqlite3.Database(path.join(__dirname, 'db', 'wordnest.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    meaning TEXT,
    language TEXT CHECK(language IN ('EN', 'JP')),
    pos TEXT,
    example TEXT
  )`);
});

// 取得所有單字或依語言篩選
app.get('/api/words', (req, res) => {
  const { language } = req.query;
  let sql = 'SELECT * FROM words';
  const params = [];

  if (language === 'EN' || language === 'JP') {
    sql += ' WHERE language = ?';
    params.push(language);
  }

  sql += ' ORDER BY id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // 將 pos 字串 JSON 解析成陣列
    const formattedRows = rows.map(row => ({
      ...row,
      pos: row.pos ? JSON.parse(row.pos) : []
    }));

    res.json(formattedRows);
  });
});

// 新增單字
app.post('/api/words', (req, res) => {
  const { word, meaning, language, pos, example } = req.body;
  const posStr = JSON.stringify(pos || []);
  db.run(
    'INSERT INTO words (word, meaning, language, pos, example) VALUES (?, ?, ?, ?, ?)',
    [word, meaning, language, posStr, example || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, word, meaning, language, pos, example });
    }
  );
});

// 取得特定id單字資料
app.get('/api/words/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM words WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: '找不到該單字' });
    row.pos = row.pos ? JSON.parse(row.pos) : [];
    res.json(row);
  });
});

// 更新單字（edit）
app.put('/api/words/:id', (req, res) => {
  const { id } = req.params;
  const { word, meaning, language, pos, example } = req.body;
  const posStr = JSON.stringify(pos || []);
  db.run(
    'UPDATE words SET word = ?, meaning = ?, language = ?, pos = ?, example = ? WHERE id = ?',
    [word, meaning, language, posStr, example || '', id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: '找不到該單字' });
      res.json({ message: '更新成功', updatedId: id });
    }
  );
});

// 刪除單字
app.delete('/api/words/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM words WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: '找不到該單字' });
    res.json({ message: '刪除成功', deletedId: id });
  });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`WordNest server http://localhost:${port}`);
});
