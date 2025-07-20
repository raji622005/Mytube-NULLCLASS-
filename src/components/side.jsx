
import './side.css';
import { sidedata } from './sidedata';
import { useLocation, useNavigate } from 'react-router-dom';

const Side = ({ showSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className={`Side ${showSidebar ? 'expanded' : 'collapsed'}`}>
      <ul className="sidelist">
      {sidedata.map((Val, key) => {
      const Icon = Val.icon;
      return (
        <li
        className={`row ${location.pathname === Val.link ? "active" : ""}`}
        key={key}
        onClick={() => navigate(Val.link)}
        >
          <div id="icon"><Icon fontSize="inherit" /></div>
          {showSidebar && <div id="title">{Val.title}</div>}
        </li>
      );
  })}
</ul>

    </div>
  );
};

export default Side;




