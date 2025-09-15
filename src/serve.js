import fs from 'fs';
import {spawn} from 'node:child_process';

const ELEVENTY_CONF_EXT = '.11tydata.json';

// find the root 11ty config file
const confFile = fs.readdirSync('./docs', {withFileTypes: true})
  .find(item => !item.isDirectory() && item.name.endsWith(ELEVENTY_CONF_EXT));

if (!confFile) {
  // fail
  console.log(`Couldn't find the root eleventy config file (should end with ${ELEVENTY_CONF_EXT}), exiting`);
  process.exit(1);
}

const docsName = confFile.name.slice(0, confFile.name.indexOf(ELEVENTY_CONF_EXT));

console.log(`Starting 11ty, docs will be hosted at http://localhost:8080/${docsName}/`);
console.log('Use ctrl-c to stop serving the docs\n');

const serve = spawn('docker', [
  'run',
  '--rm',
  '--pull=always',
  '-p',
  '8080:8080',
  '-v',
  `./docs:/site/docs/${docsName}/`,
  'ghcr.io/ukhsa-collaboration/standards-org'
]);
// route all outputs from command to this process's buffers
serve.stdout.on('data', (data) => process.stdout.write(`${data}`));
serve.stderr.on('data', (data) => process.stderr.write(`${data}`));
