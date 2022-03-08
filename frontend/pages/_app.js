import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';
import '../styles/main.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
