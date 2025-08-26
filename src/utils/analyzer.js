/* eslint-disable */

import Table from 'cli-table';
import Arborist from '@npmcli/arborist';

const table = new Table({
  head: ['Name', 'Type', '# Deps']
});
const arborist = new Arborist({
  path: './workdir/'
});

const tree = await arborist.loadVirtual();

const explicitDeps = tree.edgesOut.size;
const transitiveDeps = tree.children.size;

console.log(
  `Your package has ${explicitDeps} explicit dependencies and ${transitiveDeps} transitive dependencies.\n`
);

const seen = new Set();

for (const [name, edge] of tree.edgesOut.entries()) {
  let depType = 'runtime';

  if (edge.dev) {
    depType = 'dev';
  } else if (edge.peer) {
    depType = 'peer';
  }

  let uniqueDeps = 0,
    subDepDeps = 0;

  if (edge.to) {
    for (const [subDepName] of edge.to.edgesOut.entries()) {
      if (!seen.has(subDepName)) {
        uniqueDeps++;
      }

      seen.add(subDepName);
    }

    subDepDeps = edge.to.edgesOut.size;
  }

  table.push([name, depType, subDepDeps]);
}

table.sort((a, b) => a[1].localeCompare(b[1]) || b[2] - a[2]);

console.log(table.toString());
