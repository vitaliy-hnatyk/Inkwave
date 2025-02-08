import React from 'react';
import Designer from './pages/Designer.jsx';

import { AppProvider } from './context/AppContext.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <AppProvider>
      <Layout>
        <div className="app-content">
          <Designer />
        </div>
      </Layout>
    </AppProvider>
  );
}

export default App;