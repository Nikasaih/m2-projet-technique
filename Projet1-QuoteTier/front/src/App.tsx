import Home from './pages/home';
import Quote from './pages/quote';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AddQuote from './pages/addQuote';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/quote" element={<Quote />} />
        <Route path="/add-quote" element={<AddQuote />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
