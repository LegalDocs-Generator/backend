import { install } from 'puppeteer/install.js';
import { PUPPETEER_REVISIONS } from 'puppeteer/revisions.js';

await install({
  browser: 'chrome',
  buildId: PUPPETEER_REVISIONS.chrome,
});
