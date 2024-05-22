import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Auth0Provider } from "@auth0/auth0-react";

//import page components
import Home from './pages/Home'

import history from "./utils/history";

function App() {

  const onRedirectCallback = (appState: any) => {
    history.push(
      appState && appState.returnTo ? appState.returnTo : window.location.pathname
    );
  };

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_OAUTH_DOMAIN}
      clientId={import.meta.env.VITE_OAUTH_CLIENTID}
      onRedirectCallback={onRedirectCallback}
      authorizationParams={{
        redirect_uri: `${import.meta.env.VITE_CLIENT_URI}/callback`,
        scope: "guilds",
      }}
    >
      <HashRouter>
        <Routes>
          <Route path='/' Component={Home}  />
          <Route path='*' Component={Home}  />
        </Routes>
        <Toaster position='top-right' />
      </HashRouter>
    </Auth0Provider>
  )
}

export default App
