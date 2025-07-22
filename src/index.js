import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import { SubscribeProvider } from './components/SubscribeContext';
import { HistoryProvider } from './components/Historycontext';
import { LikedVideosProvider } from './components/Likedvideoscontext'; 
import { WatchLaterProvider } from './components/WatchLaterContext';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import { VideoCallProvider } from './components/VideoCallContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}> 
    <Provider store={store}>
      <VideoCallProvider>
      <WatchLaterProvider>
      <SubscribeProvider>
      <LikedVideosProvider>
      <HistoryProvider>
        <App />
      </HistoryProvider>
      </LikedVideosProvider> 
      </SubscribeProvider>  
      </WatchLaterProvider>
      </VideoCallProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();