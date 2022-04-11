import { useEffect, useState } from 'react';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { utils } from 'ethers';
import { usePrevious } from './usePrevious';

export function usePrevious(value:any) {

	const ref = useRef();
	  useEffect(() => {
	    ref.current = value;
	  }, [value]);
	  return ref.current;
}

export const useUserState = (route?) => {
	//wagmi hooks 
	const [{ data }, disconnect ] = useAccount();
	const [{ data: connectData, error: connectError }, connect] = useConnect();
	const [{ data: networkData, error: networkError }, switchNetwork] = useNetwork();
	
	//states that are in the UI
	const [state, setState] = useState("notConnected");
	const [loading, setLoading] = useState(false);
	const [isSwitching, setIsSwitching] = useState(false);

	const previousWalletState = usePrevious(data?.state);
	const prevUserState = usePrevious(state);

	const shouldSwitchNetwork = 
		state === "wrongNetwork" && loading && !isSwitching;

	//useEffect watching wagmo state to reflect UI
	useEffect(() => {
		if (!window.ethereum) {
			setState("noMetaMask");
			return;
		}

		//wagmi starts undefined, so it needs to hydrate first
		if (previousWalletState && !data.address) {
			setState("notConnected");
			return;
		}

		if (data?.address && networkData.chain?.name === "mainnet") {
			setState("connected");
			return;
		}, [data?.address]	

		//if we are connected, we need to check if we are on the right network
		if (data?.address && networkData.chain?.name !== "mainnet") {
			setState("wrongNetwork");
			return;
		}, [data?.address, networkData.chain?.name]);

		
