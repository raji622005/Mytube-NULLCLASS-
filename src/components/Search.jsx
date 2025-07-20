import React, { useState } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import SearchIcon from '@mui/icons-material/Search';
import SearchList from './searchlist';
import { useNavigate } from 'react-router-dom';
import './search.css';
const Search = () => {
  const [searchquery, setsearchquery] = useState("");
  const [searchlist, setsearchlist] = useState(false);
  const navigate = useNavigate();

  const Title = [
    { title: "Forest Area", id: 2 },
    { title: "1 Min Video", id: 1 },
    { title: "Time Video", id: 3 },
  ];

  const filteredTitles = Title.filter((q) =>
  q?.title?.toUpperCase().includes(searchquery.trim().toUpperCase())
);

const MakeSearch = () => {
  const trimmedQuery = searchquery.trim();

  if (!trimmedQuery) {
    return; 
  }

  const match = filteredTitles.find(item =>
    item?.title?.toUpperCase() === trimmedQuery.toUpperCase()
  );

  if (match && (typeof match.id === 'string' || typeof match.id === 'number')) {
    navigate(`/view/${match.id}`);
  } else {
    navigate('/Error');
  }
};


  const handleSuggestionClick = (titleObj) => {
    setsearchquery(titleObj.title);
    navigate(`/view/${titleObj.id}`);
    setsearchlist(false);
  };

  return (
    <div className="searchbar">
      <div className="container1">
        <div className="search_div">
          <input
            type="text"
            placeholder="Search"
            className="typesearch"
            onChange={(e) => setsearchquery(e.target.value)}
            value={searchquery}
            onClick={() => setsearchlist(true)}
          />
          <SearchIcon className="search_icon" fontSize="inherit" onClick={MakeSearch} />
          <MicIcon fontSize="inherit" className="Mic_Search" />

          {searchquery && searchlist && (
            <SearchList
              setsearchquery={setsearchquery}
              suggestions={filteredTitles}
              onSuggestionClick={handleSuggestionClick}
            />
          )}
           
        </div>
      </div>
    </div>
  );
};

export default Search;


