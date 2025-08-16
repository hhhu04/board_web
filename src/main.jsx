import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import queryClient from "./queryClient.jsx";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <App />
          <div style={{fontSize: '16px'}}>
              <ReactQueryDevtools initialIsOpen={false} />
          </div>
      </QueryClientProvider>
  </StrictMode>,
)
