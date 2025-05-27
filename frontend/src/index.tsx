import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './styles/globals.css';
import { ReissueLogConfigContext } from './context/ReissueLogConfigContext';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <ReissueLogConfigContext.Provider value={{ defaultDeliveryType: '선불', defaultReissueCost: 0, }} >
        <BrowserRouter>
          <App />
          <Toaster position="top-center" reverseOrder={false} />
        </BrowserRouter>
      </ReissueLogConfigContext.Provider>
    </Provider>
  </React.StrictMode>
);