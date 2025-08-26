import { Card, FormControl } from 'react-bootstrap';
import { useWebContainer } from 'react-webcontainers';
import { ChangeEvent, Fragment, useCallback, useState } from 'react';

/* eslint-disable import-x/default */
import analyzerSource from '../utils/analyzer.js';
import { getPageTitle, PackageManager } from '../utils';

const findFile = (files: File[], filename: string): File =>
  files.find((file) => file.name === filename);

export function Component() {
  const webContainer = useWebContainer();
  // const consoleOutput = useRef<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const appendConsoleOutput = useCallback(
    (line: string) => setConsoleOutput((existing) => [...existing, line]),
    []
  );
  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files.length) {
        return;
      }

      setConsoleOutput(['Parsing uploaded files...']);

      try {
        const files = Array.from(e.target.files);
        const packageFile = findFile(files, 'package.json');
        const packageLock = findFile(files, 'package-lock.json');
        const pnpmLock = findFile(files, 'pnpm-lock.yaml');
        const yarnLock = findFile(files, 'yarn.lock');

        const packageData = await packageFile.text();
        const lockData = await (packageLock ?? yarnLock).text();
        const fileSystem = {
          'index.js': {
            file: {
              contents: analyzerSource
            }
          },
          'package.json': {
            file: {
              contents: `
{
  "name": "analyzer",
  "type": "module",
  "dependencies": {
    "@npmcli/arborist": "^9.0.0",
    "cli-table": "^0.3.11"
  }
}
`
            }
          },
          workdir: {
            directory: {
              'package.json': {
                file: {
                  contents: packageData
                }
              }
            }
          }
        };

        let packageManager: PackageManager = PackageManager.NPM;

        if (yarnLock) {
          packageManager = PackageManager.Yarn;
        } else if (pnpmLock) {
          packageManager = PackageManager.PNPM;
        }

        appendConsoleOutput(`Detected package manager as ${packageManager}`);

        let lockFileName: string;

        switch (packageManager) {
          case PackageManager.NPM:
            lockFileName = 'package-lock.json';
            break;
          case PackageManager.Yarn:
            lockFileName = 'yarn.lock';
            break;
          case PackageManager.PNPM:
            lockFileName = 'pnpm-lock.yaml';
            break;
        }

        fileSystem['workdir']['directory'][lockFileName] = {
          file: {
            contents: lockData
          }
        };

        appendConsoleOutput('Mounting virtual filesystem...');
        await webContainer.mount(fileSystem);

        const installArgs: string[] = [];

        switch (packageManager) {
          case PackageManager.NPM:
            installArgs.push('ci');
            break;
          case PackageManager.Yarn:
            installArgs.push('install', '--immutable');
            break;
          case PackageManager.PNPM:
            installArgs.push('install');
            break;
        }

        let installer = await webContainer.spawn('npm', ['install']);

        appendConsoleOutput('Installing dependencies... (be patient)');
        await installer.exit;

        installer = await webContainer.spawn(packageManager, installArgs, {
          cwd: './workdir'
        });
        await installer.exit;

        const shrinkwrap = await webContainer.spawn('npm', ['shrinkwrap'], {
          cwd: './workdir'
        });

        appendConsoleOutput('Creating shrinkwrap...');
        await shrinkwrap.exit;

        const analyzer = await webContainer.spawn('node', ['index.js']);

        analyzer.output.pipeTo(
          new WritableStream({
            write(data) {
              appendConsoleOutput(
                `${data.replace(/([^\x20-\x7E]\[[0-9]+m)+/g, '').trim()}`
              );
            }
          })
        );

        appendConsoleOutput('Running analyzer...');
        await analyzer.exit;

        appendConsoleOutput('Analysis complete!');
      } catch (error) {
        console.error(error);
      }
    },
    [webContainer, appendConsoleOutput]
  );
  return (
    <Fragment>
      <title>{getPageTitle('Package Auditor')}</title>
      <Card bg="primary" body className="my-2" text="light">
        Select your package.json and lockfile. No data is sent to any server -
        everything runs in a{' '}
        <a
          href="https://webcontainers.io/"
          rel="noopener noreferrer"
          target="_blank"
        >
          WebContainer
        </a>{' '}
        inside your browser.
      </Card>
      <h1>
        <FormControl
          accept=".json,.yaml,.lock"
          multiple
          onChange={handleFileChange}
          type="file"
        />
      </h1>
      <div style={{ border: '4px solid #ccc', borderRadius: 8 }}>
        <div
          style={{
            minHeight: 400,
            maxHeight: 400,
            backgroundColor: '#262323',
            width: '100%',
            overflow: 'scroll'
          }}
        >
          <pre
            style={{
              color: '#33FF00',
              fontSize: 24,
              fontFamily: '"VT323", monospace',
              fontWeight: 400,
              fontStyle: 'normal',
              letterSpacing: '1.2px',
              padding: '10px'
            }}
          >
            {consoleOutput.reduce((accum, curr) => (accum += `${curr}\n`), '')}
          </pre>
        </div>
      </div>
    </Fragment>
  );
}
