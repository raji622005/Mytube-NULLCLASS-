import React from 'react';
import './Searchlist.css';
import './search.css';
import SearchIcon from '@mui/icons-material/Search';

const SearchList = ({ suggestions = [], setsearchquery, onSuggestionClick }) => {
  return (
    <div className="container">
      {suggestions.map((m, index) => (
        <p
          key={index}
          onClick={() => onSuggestionClick(m)}
          className="titleitem"
        >
          <SearchIcon style={{ marginRight: '6px' }} />
          {m.title}
        </p>
      ))}
    </div>
  );
};

export default SearchList;



