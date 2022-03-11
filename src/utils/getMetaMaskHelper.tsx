import MetaMaskOnboarding from '@metamask/onboarding';
import React, { useState, useEffect } from "react";

const ONBOARD_TEXT = 'Click here to install MetaMask!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';

declare var window: any

export function OnboardingButton() {
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef<MetaMaskOnboarding>();


  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding?.current?.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    function handleNewAccounts(newAccounts?:any) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleNewAccounts);
      window.ethereum.on('accountsChanged', handleNewAccounts);
      return () => {
        window.ethereum.off('accountsChanged', handleNewAccounts);
      };
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((newAccounts?:any) => setAccounts(newAccounts));
    } else {
      onboarding?.current?.startOnboarding();
    }
  };

  return (
    <div className="2xl">
      <button className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100" disabled={isDisabled} onClick={onClick}>
        {buttonText}
      </button>
    </div>

  );
}
