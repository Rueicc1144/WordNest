import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import EnWords from './pages/EnWords.jsx';
import JpWords from './pages/JpWords.jsx';
import JpWordList from './pages/JpWordList.jsx';
import EnWordList from './pages/EnWordList.jsx';
import JpWordEdit from './pages/JpWordEdit.jsx';
import EnWordEdit from './pages/EnWordEdit.jsx';
import Header from './component/Header.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/en" element={<EnWords />} />
        <Route path="/jp" element={<JpWords />} />
        <Route path="/jp/list" element={<JpWordList />} />
        <Route path="/en/list" element={<EnWordList />} />
        <Route path="/jp/edit/:id" element={<JpWordEdit />} />
        <Route path="/en/edit/:id" element={<EnWordEdit />} />
      </Routes>
    </>
  );
}

export default App;
