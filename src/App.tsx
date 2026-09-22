import { useState, useEffect } from 'react';
import { Storefront } from './components/Storefront';
import { AdminPage } from './pages/Admin';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === '/admin' || currentPath.startsWith('/admin')) {
    return <AdminPage />;
  }

  return <Storefront />;
}

export default App;
