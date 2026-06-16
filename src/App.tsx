// import React from 'react';
// import { RouterProvider } from 'react-router-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
// import { router } from './routes';

import { LayoutRoutes } from './Routes/LayoutRoutes';

const router = createBrowserRouter(LayoutRoutes);

export default function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
