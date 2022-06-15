import admin, { ServiceAccount } from 'firebase-admin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { firebase } = require('../credentials/secrets.json');

export function initialize() {
  admin.initializeApp({
    credential: admin.credential.cert(firebase as ServiceAccount),
  });
}

export default { initialize };
