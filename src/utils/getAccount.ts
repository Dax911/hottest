//import Web3 from "web3";

import Web3 from "web3";

var web3 = require('web3');

declare var window: any;
web3 = new Web3(web3.currentProvider)

export default async function getAccount() {
    //await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const nullaccount = null;
    if (accounts[0] === nullaccount) {
        return 'null';
    } else {
        return accounts[0];
    }
    }