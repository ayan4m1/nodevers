import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import './index.scss';
import Layout from './components/Layout';
import SuspenseFallback from './components/SuspenseFallback';
import ErrorBoundary from './components/ErrorBoundary';

const root = createRoot(document.getElementById('root'));
const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        lazy: () => import(`./pages/nodeVersions`)
      },
      {
        path: 'package',
        children: [
          {
            index: true,
            lazy: () => import(`./pages/packageVersions`)
          },
          {
            path: 'audit',
            lazy: () => import(`./pages/auditPackage`)
          }
        ]
      }
    ]
  }
]);

root.render(
  <Suspense fallback={<SuspenseFallback />}>
    <RouterProvider router={router} />
  </Suspense>
);
