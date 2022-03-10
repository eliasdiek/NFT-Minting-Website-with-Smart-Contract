import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import Layout from '../components/layout/Layout';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";

import '../styles/globals.css';
import '../styles/main.css';

function getLibrary(provider) {
  return new Web3Provider(provider)
}

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Web3ReactProvider>
    </Provider>
  );
}

export default MyApp;
