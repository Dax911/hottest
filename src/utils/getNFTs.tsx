//call trpc endpoint to get NFTs
//call the state to get account info 

import MetaMaskOnboarding from '@metamask/onboarding';
import React, { useState, useEffect } from "react";

export function doStuff() {
  const [accounts, setAccounts] = React.useState([])
  const accounts = ethereum.on('accountsChanged', (newAccounts?:any) => {
    setAccounts(newAccounts);
  }
}