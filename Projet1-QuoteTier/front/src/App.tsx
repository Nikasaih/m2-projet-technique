import Home from './pages/home';
import Quote from './pages/quote';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AddQuote from './pages/addQuote';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/quote" element={<Quote />} />
        <Route path="/add-quote" element={<AddQuote />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
