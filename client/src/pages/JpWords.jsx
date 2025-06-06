import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';

const posOptions = [
  '名', '自サ', '他サ', '形', '形動', '自五', '他五', '自下一', '他下一',
  '自上一', '他上一', '副', '接', '接助', '接續'
];

const JpWords = () => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [selectedPos, setSelectedPos] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const togglePos = (pos) => {
    setSelectedPos((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || !meaning) {
      alert('請輸入單字與中文意思');
      return;
    }

    try {
      const res = await fetch('https://render.com/docs/web-services#port-binding/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          meaning,
          language: 'JP',
          pos: selectedPos,
          example,
        }),
      });

      if (!res.ok) throw new Error('新增失敗');

      const data = await res.json();
      console.log('已新增：', data);

      setWord('');
      setMeaning('');
      setExample('');
      setSelectedPos([]);
      setStatusMessage('單字新增成功！');

      setTimeout(() => setStatusMessage(''), 2000);
    } catch (err) {
      console.error(err);
      setStatusMessage('新增失敗，請檢查伺服器是否啟動');
    }
  };

  return (
    <div className="form-container">
      <h2>新增日文單字</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="單字（漢字或假名）"
        />
        <input
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="中文意思"
        />
        <input
          type="text"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="例句（可選）"
        />

        <div className="pos-checkbox-group">
          {posOptions.map((pos) => (
            <label
              key={pos}
              className={`pos-checkbox ${selectedPos.includes(pos) ? 'checked' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedPos.includes(pos)}
                onChange={() => togglePos(pos)}
              />
              {pos}
            </label>
          ))}
        </div>

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        <button type="submit" className="submit-button">新增</button>
      </form>

      <button className="navigate-button" onClick={() => navigate('/jp/list')}>
        查看已新增單字
      </button>
    </div>
  );
};

export default JpWords;
