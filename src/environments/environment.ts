// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  googleMapsApiKey: 'AIzaSyAK4SToF8JnwGlIIi28zar7_A0cUiZi8uo',
  serverBaseUrl: 'https://api.homeshef.in/api/',
  serverImageUrl: 'https://api.homeshef.in/storage/',
  adminURL: 'https://api.homeshef.in/administration/',
  basic:'123456',
  communityId : 1,
  authToken: '123456',
  stripe: {
    publishableKey: 'your_test_publishable_key',
    secretKey: 'your_test_secret_key',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
