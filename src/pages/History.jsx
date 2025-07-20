import React from 'react';
import { useHistory } from '../components/Historycontext.jsx';
import './History.css';

const History = () => {
  const { history, removeFromHistory, clearHistory } = useHistory();

  return (
    <div className="history-page">
      <h2>Watch History</h2>
      {history.length === 0 ? (
        <p>No videos watched yet.</p>
      ) : (
        <div>
          <button onClick={clearHistory}>Clear All History</button>
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                <p>{item.title}</p>
                <small>Watched at: {item.watchedAt?.toDate().toLocaleString() || 'Unknown'}</small>
                <button onClick={() => removeFromHistory(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default History;



