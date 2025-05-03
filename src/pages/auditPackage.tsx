import { Fragment } from 'react';

import { getPageTitle } from '../utils';

export function Component() {
  return (
    <Fragment>
      <title>{getPageTitle('Package Auditor')}</title>
      <h1>
        Coming Soon <sup>&trade;</sup>
      </h1>
    </Fragment>
  );
}
