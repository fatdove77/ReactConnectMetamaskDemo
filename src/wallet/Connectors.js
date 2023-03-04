import { InjectedConnector } from '@web3-react/injected-connector'
import {NETWORK} from '../blockChain/netConfig'
export const injected = new InjectedConnector({
  supportedChainIds: [1,43113,3021,NETWORK.chainId,12307] 
})
