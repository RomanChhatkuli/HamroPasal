import React, { useState } from 'react';
import { Search, MoveLeft } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { Link, useLocation } from 'react-router-dom';
import useMobile from '../Hooks/useMobile';

function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [isMobile] = useMobile()
  const location = useLocation()

  const isSearchPage = location.pathname === '/search'

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      {/* Search Icon */}
      {!(isMobile && isSearchPage) ?
        (<Link >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 mr-2" />
        </Link>)
        :
        (<Link onClick={() => window.history.back()} >
          <MoveLeft size={16} className="absolute left-2 top-1/2 -translate-y-1/2 " />
        </Link>)
      }

      {/* Input Field */}
      <Link to="/search">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="md:w-[450px] min-w-[300px] lg:w-[550px] lg:h-12 pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffbf00] bg-slate-50"
        />
      </Link>

      {inputValue === '' && (
        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <TypeAnimation
            sequence={[
              'Search "milk"',
              1000,
              'Search "bread"',
              1000,
              'Search "sugar"',
              1000,
              'Search "butter"',
              1000,
              'Search "rice"',
              1000,
              'Search "egg"',
              1000,
              'Search "chips"',
              1000,
            ]}
            wrapper="span"
            speed={25}
            repeat={Infinity}
          />
        </div>
      )}

    </div>
  );
}

export default SearchBar;
