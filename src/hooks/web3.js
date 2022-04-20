import Web3 from 'web3';

export const useContract = (web3, abi, address) => {
    if(web3.active)
        return new web3.library.eth.Contract (abi, address);
    return null
};