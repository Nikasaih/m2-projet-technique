import Home from './pages/home';
import Quote from './pages/quote';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AddQuote from './pages/addQuote';
import Navbar from './components/Navbar';
import EditQuote from './pages/editQuote';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/quote" element={<Quote />} />
        <Route path="/add-quote" element={<AddQuote />} />
        <Route path="/edit-quote/:id" element={<EditQuote />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
