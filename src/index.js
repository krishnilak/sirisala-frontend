import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "@asgardeo/auth-react";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <AuthProvider
        config={{
            signInRedirectURL: "http://localhost:3000/",
            signOutRedirectURL: "http://localhost:3000/",
            clientID: "B2zr48RKlLVhVzfphvRMDKCVlkIa",
            baseUrl: "https://api.asgardeo.io/t/petstorekla",
            scope: [ "openid","profile" ],
            resourceServerURLs: ["http://localhost:8080/api"]
        }}
    >
        <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossorigin></script>
        <script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js" crossorigin></script>
        {/* <script src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js" crossorigin></script> */}
        <App />
    </AuthProvider>
);
