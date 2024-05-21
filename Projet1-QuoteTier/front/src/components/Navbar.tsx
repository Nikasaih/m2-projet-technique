import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Home</Link>
        </li>
        <li>
          <Link to="/add-quote" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Create Quote</Link>
        </li>
        {/* <li>
          <Link to="/quote" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Quote</Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
