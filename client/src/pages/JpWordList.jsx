// client/src/pages/JpWordList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WordList.css';
import API_BASE_URL from '../config';

const JpWordList = () => {
  const [words, setWords] = useState([]);
  const navigate = useNavigate();

  const fetchWords = async () => {
    const res = await fetch(`${API_BASE_URL}/api/words?language=JP`);
    const data = await res.json();
    const parsedData = data.map((word) => ({
      ...word,
      pos: typeof word.pos === 'string' ? JSON.parse(word.pos) : word.pos || []
    }));
    setWords(parsedData);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這筆單字嗎？')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/words/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      console.log('刪除:', data);
      fetchWords(); 
    } catch (error) {
      console.error('刪除失敗', error);
      alert('刪除失敗');
    }
  };

  const handleEdit = (id) => {
    navigate(`/jp/edit/${id}`);
  };

  return (
    <div className="list-container">
      <h2>日文單字清單</h2>
      <ul className="word-list">
        {words.map((word) => (
          <li key={word.id} className="word-item">
            <strong>{word.word}</strong>（{word.meaning}）
            <div className="pos-list">
              {word.pos.map((p, index) => (
                <span key={index} className="pos-tag">{p}</span>
              ))}
            </div>
            {word.example && <div className="example">例句：{word.example}</div>}

            <div className="action-buttons">
              <button onClick={() => handleEdit(word.id)}>編輯</button>
              <button onClick={() => handleDelete(word.id)}>刪除</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JpWordList;
