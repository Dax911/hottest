import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { utils } from "ethers";
import usePrevious from "./usePrevious";



type WalletStates =
  | 'noMetamask'
  | 'notConnected'
  | 'wrongNetwork'
  | 'signature'
  | 'connected'



export const useUserState = ( ) => {
	// wagmi hooks that handle talking to metamask
	const [{ data }, disconnect] = useAccount();
	const [{ data: connectData, error: connectError }, connect] = useConnect();
	const [{ data: networkData, error: networkError }, switchNetwork] =
		useNetwork();

	// states that are used to control the UI
	const [state, setState] = useState<WalletStates>('notConnected');	
	const [loading, setLoading] = useState( false );
	const [isSwitching, setIsSwitching] = useState( false );

	const previousWalletState = usePrevious( data?.address );
	const prevUserState = usePrevious( state );

	const shouldSwitchNetwork =
		state === "wrongNetwork" && loading && !isSwitching;

	// effects watching wagmi state to reflect the UI
	useEffect( () => {
		if ( !window.ethereum ) {
			setState( "noMetamask" );
			return;
		}

		// wagmi starts undefined, so we need to wait for it to hydrate
		if ( previousWalletState && !data?.address ) {
			setState( "notConnected" );
			return;
		}

		if ( data?.address && networkData.chain?.name === "mainnet" ) {
			setState( "connected" );
			return;
		}
		// if we're connected the next step is to check if we're on the right network
		if ( data?.address && networkData.chain?.name !== "mainnet" ) {
			setState( "wrongNetwork" );
			return;
		}
	}, [data?.address, networkData.chain?.name] );

	useEffect( () => {
		if ( connectError || networkError ) {
			setLoading( false );
		}
	}, [connectError, networkError] );

	// effects controlling flows after the login
	useEffect( () => {
		if ( shouldSwitchNetwork ) {
			handleSwitchNetwork();
		}
	}, [state, prevUserState] );

	const handleSwitchNetwork = async () => {
		if ( switchNetwork ) {
			setIsSwitching( true );
			await switchNetwork( 4 );
			setIsSwitching( false );
		}
	};

	const handleConnect = async () => {
		setLoading( true );
		if ( state === "notConnected" ) {
			try {
				await connect( connectData?.connectors[0] );
			} catch ( e ) {
				setLoading( false );
			}
		}

		if ( state === "wrongNetwork" ) {
			await handleSwitchNetwork();
			return;
		}
	};

	const handleDisconnect = () => {
		disconnect();
	};

	return {
		handleConnect,
		handleDisconnect,
		userState: state,
		loading,
		currentAccount: data?.address,
	};
};