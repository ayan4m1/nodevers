import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.scss';
import Layout from 'components/Layout';
import SuspenseFallback from 'components/SuspenseFallback';

const createRouteForPage = (pathOrIndex, pageName) => {
  const result = {};

  if (typeof pathOrIndex === 'boolean') {
    result.index = pathOrIndex;
  } else if (typeof pathOrIndex === 'string') {
    result.path = pathOrIndex;
  }

  result.lazy = () => import(`pages/${pageName}`);

  return result;
};

const root = createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
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
