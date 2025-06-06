import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';

const posOptions = [
  'noun', 'verb', 'adjective', 'adverb',
  'preposition', 'conjunction', 'interjection',
  'pronoun', 'determiner', 'modal'
];

const EnWords = () => {
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
      alert('Please enter both word and meaning.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          meaning,
          language: 'EN',
          pos: selectedPos,
          example,
        }),
      });

      if (!res.ok) throw new Error('Failed to add word');

      const data = await res.json();
      console.log('Added:', data);

      setWord('');
      setMeaning('');
      setExample('');
      setSelectedPos([]);
      setStatusMessage('Word added successfully!');

      setTimeout(() => setStatusMessage(''), 2000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to add word. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Add English Word</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Word"
        />
        <input
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="Meaning"
        />
        <input
          type="text"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="Example sentence"
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

        <button type="submit" className="submit-button">Add</button>
      </form>

      <button className="navigate-button" onClick={() => navigate('/en/list')}>
        View Added Words
      </button>
    </div>
  );
};

export default EnWords;
