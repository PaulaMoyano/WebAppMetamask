import { InjectedConnector } from '@web3-react/injected-connector' //libreria para conectar a metamask
export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 1337], // 1337: id del chain local de ganache
})