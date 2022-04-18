import 'bootstrap/dist/css/bootstrap.min.css';
import Index from './pages';
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

function getLibrary(provider) {
  return new Web3(provider)
}

function App({ pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Index {...pageProps}/> 
    </Web3ReactProvider>
  );
}

export default App;
