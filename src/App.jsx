import { RouterProvider } from 'react-router-dom';
import router from './routes/index';
import { AuthProvider } from './context/AuthContext';

/**
 * App
 * Root component — hands control entirely to the router.
 * All layout and page rendering is managed via the route tree.
 */
function App() {
  return <AuthProvider><RouterProvider router={router} /></AuthProvider>;
}

export default App;
