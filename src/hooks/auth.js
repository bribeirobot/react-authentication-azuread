import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

import {
  msalConfig,
  loginRequest,
} from '../utils/configAzureAd';
import { getUserDetails } from '../utils/graphService';

const AuthContext = createContext({});

const msalInstance = new PublicClientApplication(msalConfig);

const AuthProvider = ({ children }) => {
  const [accountInfo, setAccountInfo] = useState({
    isAuthenticated: false,
    user: {},
    error: null,
  });

  const signIn = async () => {
    try {
      await msalInstance.loginPopup(
        {
          // scopes: loginRequest.scopes,
          // prompt: "select_account"
        });

      await getUserProfile();
    }
    catch (err) {
      setAccountInfo({
        isAuthenticated: false,
        user: {},
        error: err,
      });
    }
  }

  const signOut = () => {
    localStorage.removeItem('@AzureAd:accessToken');
    msalInstance.logout();
  }

  const getToken = async (scopes) => {
    try {
      const accounts = msalInstance.getAllAccounts();

      if (accounts.length <= 0) throw new Error('Login required');
      const silentResult = await msalInstance.acquireTokenSilent({
        scopes: scopes,
        account: accounts[0]
      });
      
      return silentResult;
    } catch (err) {
      if (err) {
        const interactiveResult = await msalInstance.acquireTokenPopup();

        return interactiveResult.accessToken;
      } else {
        throw err;
      }
    }
  }

  const getUserProfile = useCallback(async () => {
    try {
      const result  = await getToken(loginRequest.scopes);
      if(result) {
        
        const accessToken = result.idToken;
        console.log(`-----------${accessToken}--------`);
        const user = await getUserDetails(result.idTokenClaims.extension_FieldsLogisticPlatform);
        if (accessToken) {
          localStorage.setItem('@AzureAd:accessToken', accessToken);
        
          setAccountInfo({
            isAuthenticated: true,
            user: {
              displayName: user.displayName,
              email: user.mail || user.userPrincipalName,
              employees: user.employees
            },
            error: null
          });
        }
      }else {
        setAccountInfo({
          isAuthenticated: true,
          user: {
            displayName: 'Bruno',
            email: "Bruno@test.com.br",
          },
          error: null
        });
      }
    }
    catch (err) {
      setAccountInfo({
        isAuthenticated: false,
        user: {},
        error: err,
      });
    }
  }, []);

  useEffect(() => {
    const accounts = msalInstance.getAllAccounts();

    if (accounts && accounts.length > 0) {
      getUserProfile();
    }
  }, [getUserProfile]);

  return (
    <AuthContext.Provider value={{ signIn, signOut, accountInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
