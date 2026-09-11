import { RouterProvider } from 'react-router-dom';
import router from './routes/index';

/**
 * App
 * Root component — hands control entirely to the router.
 * All layout and page rendering is managed via the route tree.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
