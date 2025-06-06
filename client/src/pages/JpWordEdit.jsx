// client/src/pages/JpWordEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Form.css';
import API_BASE_URL from '../config';

const posOptions = [
  '名', '自サ', '他サ', '形', '形動', '自五', '他五', '自下一', '他下一',
  '自上一', '他上一', '副', '接', '接助', '接續'
];

const JpWordEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [selectedPos, setSelectedPos] = useState([]);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/words/${id}`);
        if (!res.ok) throw new Error('無法取得資料');
        const data = await res.json();
        setWord(data.word);
        setMeaning(data.meaning);
        setExample(data.example);
        setSelectedPos(typeof data.pos === 'string' ? JSON.parse(data.pos) : data.pos || []);
      } catch (error) {
        alert('讀取資料失敗');
        navigate('/jp/list');
      }
    };
    fetchWord();
  }, [id, navigate]);

  const togglePos = (pos) => {
    setSelectedPos((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || !meaning) {
      alert('請填寫單字與意思');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/words/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          meaning,
          language: 'JP',
          pos: selectedPos,
          example,
        }),
      });
      if (!res.ok) throw new Error('更新失敗');
      alert('更新成功');
      navigate('/jp/list');
    } catch (error) {
      alert('更新失敗');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>編輯日文單字</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="單字"
        />
        <input
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="意思"
        />
        <input
          type="text"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="例句"
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

        <button type="submit" className="submit-button">更新</button>
      </form>
    </div>
  );
};

export default JpWordEdit;
