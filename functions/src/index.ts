import * as functions from 'firebase-functions';
import { auth } from 'google-auth-library';
import * as api from 'kubernetes-client';

const Client = api.Client1_10;
const config = api.config;
let client: api.Api;
const loadConfig = async () => {
  const accessToken = await auth.getAccessToken();

  const kubeconfig = {
    'apiVersion': 'v1',
    'clusters': [
      {
        'cluster': {
          'certificate-authority-data': 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURDekNDQWZPZ0F3SUJBZ0lRWUkzZDg3dEw1eFl1eDc1VDlSMHBYakFOQmdrcWhraUc5dzBCQVFzRkFEQXYKTVMwd0t3WURWUVFERXlRek5qZzBPREZsTkMwNFlUSTFMVFJtWWpVdE9EazBOaTAyTXpWaU5EVXpZelU1TkRVdwpIaGNOTVRneE1qQXhNVEF6T0RVMldoY05Nak14TVRNd01URXpPRFUyV2pBdk1TMHdLd1lEVlFRREV5UXpOamcwCk9ERmxOQzA0WVRJMUxUUm1ZalV0T0RrME5pMDJNelZpTkRVell6VTVORFV3Z2dFaU1BMEdDU3FHU0liM0RRRUIKQVFVQUE0SUJEd0F3Z2dFS0FvSUJBUURxUWpoUnBTQmRRSWdPN1JIa2ZsbE84SEVjOW1saTd4cE91cUFsTVIxQwpUZmU1MW9McGczZXF2SGhEdWVlcDduMm1hYmc0d1BKSU1haUF4KzArVE45VHpwS2d1aWRkZUQxV0Z1ejhDbU5QClBoZGNKZVdSaWtxLzlwQzhYQzh1VytjRERkdW82NDM0d09PWGFIcHpsUElJelNUblVOSVBYNHRUZ0NZRFAxNmkKeWYrcXRVNTNjSUpBLzN6TmRFME9xcVZoZE5HYmpwRVVzME5IeHB4ZFI5WEZMUXB5VC93ekVWTCt5TGtzQUdRdgpLSUJVdWtaaUtRalpjbHRGNU9GM0xlcWV4TFB6WCtxYmtyVkdYYUVnczBEUHNGczlrKzhJNmo1cE5XVjFkMEdWCmgxU1BpdnZXRW5yd1AzOW43WndlT1QvRXFoelNValdxZnZpRVZTMEwxSXYxQWdNQkFBR2pJekFoTUE0R0ExVWQKRHdFQi93UUVBd0lDQkRBUEJnTlZIUk1CQWY4RUJUQURBUUgvTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFDZwpRbUYrbFJPdGsvc1BPc2s2UVN2bXJpOEltYzV4S0w3b0VBajVMUkxMbXlva2J0Z0NwL1lTREVnNCsvOEFadzlpCmpGMTdkVzZ5c0hDZ2lzYm03QmFhWUVWMnRsWmY5VUsxNWVzVkxBL0QrNVJ4UDMva2o3d09qR2x6MVQzZk4vRTEKTHYwdjhpVFlSN0toUXhlQWlOclZuSVh4bmRGMzNZcmt5K2t0WEdaL3RyMUZHb0xnYXFpUVFpS09OeUZTYkp4VwpPZjAvNFNEMUljZTl4Q1k0OStXYkU4TFR0cGFQUzRHS3dhYTdDdG5GWVNIVzJCbldyN243TmZwN3YrREZmSlQxClRCcjU0dzhMZzdNYkkrbTdsc3VLUUJZN0ZNcEdvSm1PaCtiUjRQK0lGbE9yVW5sVjFLYWJBNW9YNmZ5aUpJRjkKcVNxUTV2WXlMdlNwOFY2S0RGTlIKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=',
          'server': 'https://35.224.175.229'
        },
        'name': 'gke_chrome-recording-208807_us-central1-a_your-first-cluster-1'
      }
    ],
    'contexts': [
      {
        'context': {
          'cluster': 'gke_chrome-recording-208807_us-central1-a_your-first-cluster-1',
          'user': 'gke_chrome-recording-208807_us-central1-a_your-first-cluster-1'
        },
        'name': 'gke_chrome-recording-208807_us-central1-a_your-first-cluster-1'
      }
    ],
    'current-context': 'gke_chrome-recording-208807_us-central1-a_your-first-cluster-1',
    'kind': 'Config',
    'users': [
      {
        'name': 'gke_chrome-recording-208807_us-central1-a_your-first-cluster-1',
        'user': {
          'auth-provider': {
            'config': {
              'access-token': accessToken
            },
            'name': 'gcp'
          }
        }
      }
    ]
  }
  client = new Client({ config: config.fromKubeconfig(kubeconfig) });
}

loadConfig()
  .then(() => console.log('loadConfig'))
  .catch(() => console.log('loadConfig: error'));

export const namespaces = functions.https.onRequest((request, response) => {
  console.log('namespaces');
  client.api.v1.namespaces.get()
    .then((res) => {
      console.log(`Namespaces: ${res}`);
      response.write(JSON.stringify(res, null , "  "));
      response.end();
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
      response.write(JSON.stringify(err, null , "  "));
      response.end();
    });
});
  
export const pods = functions.https.onRequest((request, response) => {
  console.log('pods');
  client.api.v1.namespaces('default').pods.get()
    .then((res) => {
      console.log(`Pods: ${res}`);
      response.write(JSON.stringify(res, null , "  "));
      response.end();
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
      response.write(JSON.stringify(err, null , "  "));
      response.end();
    });
});

export const deployments = functions.https.onRequest((request, response) => {
  console.log('deployments');
  client.api.apps.v1.namespaces('default').deployments.get()
    .then((res) => {
      console.log(`Deployments: ${res}`);
      response.write(JSON.stringify(res, null , "  "));
      response.end();
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
      response.write(JSON.stringify(err, null , "  "));
      response.end();
    });
});

export const services = functions.https.onRequest((request, response) => {
  console.log('services');
  client.api.v1.namespaces('default').services.get()
    .then((res) => {
      console.log(`Services: ${res}`);
      response.write(JSON.stringify(res, null , "  "));
      response.end();
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
      response.write(JSON.stringify(err, null , "  "));
      response.end();
    });
});

export const run = functions.https.onRequest((request, response) => {
  console.log('run');
  client.apis.apps.v1.namespaces('default').deployments.post({ body: {
    'kind': 'Deployment',
    'spec': {
      'replicas': 1,
      'template': {
        'spec': {
          'containers': [
            {
              'image': 'gcr.io/chrome-recording-208807/headless-chrome-docker',
              'name': 'headless-chrome-docker',
              'ports': [
                {
                  'containerPort': 3000
                }
              ]
            }
          ]
        },
        'metadata': {
          'labels': {
            'run': 'headless-chrome-docker'
          }
        }
      },
      'selector': {
        'matchLabels': {
          'run': 'headless-chrome-docker'
        }
      }
    },
    'apiVersion': 'apps/v1',
    'metadata': {
      'labels': {
        'run': 'headless-chrome-docker'
      },
      'name': 'headless-chrome-docker'
    }
  }})
   .then((resDeployment) => {
      console.log(`Deployment: ${resDeployment}`);
      response.write(JSON.stringify(resDeployment, null , "  "));
      client.apis.v1.namespaces('default').services.post({ body: {
        'kind': 'Service',
        'spec': {
          'type': 'LoadBalancer',
          'ports': [
            {
              'port': 3000,
              'protocol': 'TCP',
              'targetPort': 3000
            }
          ],
          'selector': {
            'run': 'headless-chrome-docker'
          }
        },
        'apiVersion': 'v1',
        'metadata': {
          'name': 'headless-chrome-docker'
        }
      }})
        .then((resService) => {
          console.log(`Service: ${resService}`);
          response.write(JSON.stringify(resService, null , "  "));
          response.end();
        })
        .catch((err) => {
          console.log(`Error: ${err}`);
          response.write(JSON.stringify(err, null , "  "));
          response.end();
        });
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
      response.write(JSON.stringify(err, null , "  "));
      response.end();
    });
});

export const remove = functions.https.onRequest((request, response) => {
  console.log('remove');

  client.apis.v1.namespaces('default').services('headless-chrome-docker').delete()
    .then((resService) => {
      console.log(`Delete Service: ${resService}`);
      response.write(JSON.stringify(resService, null , "  "));
      
      client.apis.apps.v1.namespaces('default').deployments('headless-chrome-docker').delete()
      .then((resDeployment) => {
        console.log(`Delete Deployment: ${resDeployment}`);
        response.write(JSON.stringify(resDeployment, null , "  "));
        response.end();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        response.write(JSON.stringify(err, null , "  "));
        response.end();
      });
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
      response.write(JSON.stringify(err, null , "  "));
      response.end();
    });
});
