import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {QueryClient , QueryClientProvider} from 'react-query'
import { BrowserRouter } from 'react-router-dom';


const client = new QueryClient({})
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
          <BrowserRouter>
          <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
</BrowserRouter>
   
  </React.StrictMode>
)
