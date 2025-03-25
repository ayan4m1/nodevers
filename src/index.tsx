import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import {
  RouteObject,
  RouterProvider,
  createHashRouter
} from 'react-router-dom';

import './index.scss';
import Layout from './components/Layout';
import SuspenseFallback from './components/SuspenseFallback';
import ErrorBoundary from './components/ErrorBoundary';

const createRouteForPage = (
  pathOrIndex: boolean | string,
  pageName: string
): RouteObject => {
  if (typeof pathOrIndex === 'boolean' && (pathOrIndex as boolean)) {
    return {
      index: true,
      lazy: () => import(`pages/${pageName}`)
    };
  } else if (typeof pathOrIndex === 'string') {
    return {
      path: pathOrIndex,
      lazy: () => import(`pages/${pageName}`)
    };
  }
};

const root = createRoot(document.getElementById('root'));
const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      createRouteForPage(true, 'nodeVersions'),
      createRouteForPage('packages', 'packageVersions')
    ]
  }
]);

root.render(
  <Suspense fallback={<SuspenseFallback />}>
    <RouterProvider router={router} />
  </Suspense>
);
