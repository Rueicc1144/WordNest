// client/src/pages/EnWordList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WordList.css';

const EnWordList = () => {
  const [words, setWords] = useState([]);
  const navigate = useNavigate();

  const fetchWords = async () => {
    const res = await fetch('https://render.com/docs/web-services#port-binding/words?language=EN');
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
    if (!window.confirm('確定要刪除這個單字嗎？')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/words/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setWords(words.filter(word => word.id !== id));
      } else {
        alert('刪除失敗');
      }
    } catch (error) {
      console.error('刪除英文單字失敗', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/en/edit/${id}`);
  };

  return (
    <div className="list-container">
      <h2>英文單字清單</h2>
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

export default EnWordList;
