import * as functions from 'firebase-functions';
import { auth } from 'google-auth-library';
import k8s = require('@kubernetes/client-node');
// import fs = require('fs');

const kc = new k8s.KubeConfig();

// fs.createReadStream('./config.txt').pipe(fs.createWriteStream('/tmp/config.txt'));
// kc.loadFromFile('/tmp/config.txt');

let k8sApi;
const loadConfig = async () => {
  const accessToken = await auth.getAccessToken();
  kc.loadFromString(`
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURDekNDQWZPZ0F3SUJBZ0lRWUkzZDg3dEw1eFl1eDc1VDlSMHBYakFOQmdrcWhraUc5dzBCQVFzRkFEQXYKTVMwd0t3WURWUVFERXlRek5qZzBPREZsTkMwNFlUSTFMVFJtWWpVdE9EazBOaTAyTXpWaU5EVXpZelU1TkRVdwpIaGNOTVRneE1qQXhNVEF6T0RVMldoY05Nak14TVRNd01URXpPRFUyV2pBdk1TMHdLd1lEVlFRREV5UXpOamcwCk9ERmxOQzA0WVRJMUxUUm1ZalV0T0RrME5pMDJNelZpTkRVell6VTVORFV3Z2dFaU1BMEdDU3FHU0liM0RRRUIKQVFVQUE0SUJEd0F3Z2dFS0FvSUJBUURxUWpoUnBTQmRRSWdPN1JIa2ZsbE84SEVjOW1saTd4cE91cUFsTVIxQwpUZmU1MW9McGczZXF2SGhEdWVlcDduMm1hYmc0d1BKSU1haUF4KzArVE45VHpwS2d1aWRkZUQxV0Z1ejhDbU5QClBoZGNKZVdSaWtxLzlwQzhYQzh1VytjRERkdW82NDM0d09PWGFIcHpsUElJelNUblVOSVBYNHRUZ0NZRFAxNmkKeWYrcXRVNTNjSUpBLzN6TmRFME9xcVZoZE5HYmpwRVVzME5IeHB4ZFI5WEZMUXB5VC93ekVWTCt5TGtzQUdRdgpLSUJVdWtaaUtRalpjbHRGNU9GM0xlcWV4TFB6WCtxYmtyVkdYYUVnczBEUHNGczlrKzhJNmo1cE5XVjFkMEdWCmgxU1BpdnZXRW5yd1AzOW43WndlT1QvRXFoelNValdxZnZpRVZTMEwxSXYxQWdNQkFBR2pJekFoTUE0R0ExVWQKRHdFQi93UUVBd0lDQkRBUEJnTlZIUk1CQWY4RUJUQURBUUgvTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFDZwpRbUYrbFJPdGsvc1BPc2s2UVN2bXJpOEltYzV4S0w3b0VBajVMUkxMbXlva2J0Z0NwL1lTREVnNCsvOEFadzlpCmpGMTdkVzZ5c0hDZ2lzYm03QmFhWUVWMnRsWmY5VUsxNWVzVkxBL0QrNVJ4UDMva2o3d09qR2x6MVQzZk4vRTEKTHYwdjhpVFlSN0toUXhlQWlOclZuSVh4bmRGMzNZcmt5K2t0WEdaL3RyMUZHb0xnYXFpUVFpS09OeUZTYkp4VwpPZjAvNFNEMUljZTl4Q1k0OStXYkU4TFR0cGFQUzRHS3dhYTdDdG5GWVNIVzJCbldyN243TmZwN3YrREZmSlQxClRCcjU0dzhMZzdNYkkrbTdsc3VLUUJZN0ZNcEdvSm1PaCtiUjRQK0lGbE9yVW5sVjFLYWJBNW9YNmZ5aUpJRjkKcVNxUTV2WXlMdlNwOFY2S0RGTlIKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
    server: https://35.224.175.229
  name: gke_chrome-recording-208807_us-central1-a_your-first-cluster-1
contexts:
- context:
    cluster: gke_chrome-recording-208807_us-central1-a_your-first-cluster-1
    user: gke_chrome-recording-208807_us-central1-a_your-first-cluster-1
  name: gke_chrome-recording-208807_us-central1-a_your-first-cluster-1
current-context: gke_chrome-recording-208807_us-central1-a_your-first-cluster-1
kind: Config
preferences: {}
users:
- name: gke_chrome-recording-208807_us-central1-a_your-first-cluster-1
  user:
    auth-provider:
      config:
        access-token: ${accessToken} 
      name: gcp
`);

  k8sApi = kc.makeApiClient(k8s.Core_v1Api);
}

loadConfig()
  .then(() => console.log('loadConfig'))
  .catch(() => console.log('loadConfig: error'));

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const listpods = functions.https.onRequest((request, response) => {
  console.log('listpods');
  k8sApi.listNamespacedPod('default')
    .then((res) => {
      console.log(res.body);
      response.write(JSON.stringify(res.body, null , "  "));
      response.end();
    })
    .catch((err) => {
      console.log(err);
      response.write(JSON.stringify(err, null , "  "));
      response.end();
    });
});

