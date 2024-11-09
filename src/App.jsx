import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './pages/Index';
import ImageGenerator from './pages/ImageGenerator';
import Documentation from './pages/Documentation';
import SharedImageView from './pages/SharedImageView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/create',
    element: <ImageGenerator />,
  },
  {
    path: '/remix/:imageId',
    element: <ImageGenerator />,
  },
  {
    path: '/docs',
    element: <Documentation />,
  },
  {
    path: '/image/:imageId',
    element: <SharedImageView />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;