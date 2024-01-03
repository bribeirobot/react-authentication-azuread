import {  LogLevel, BrowserCacheLocation } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    //utilizar o secret somente quando for webapp spa não precisa.
    // clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    authority: 'https://gboticariob2cauthhml.b2clogin.com/gboticariob2cauthhml.onmicrosoft.com/B2C_1_SIU_PlataformaLogistica_DEV',
    knownAuthorities: ['gboticariob2cauthhml.b2clogin.com'],

  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose,
    },
  },
}

export const loginRequest = {
  scopes: ['openid', 'offline_access' ],
}
