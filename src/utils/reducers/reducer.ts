export const reducer = (state: { provider: any; signer: any; name: any; chainId: any; foxcon2022: any; user: any; isLoading: boolean; isConnected: boolean }, action: { type: any; payload: { provider: any; signer: any; name: any; chainId: any; foxcon2022: any } }) => {
    switch (action.type) {
      case 'CONNECTED_PROVIDER': {
        state.provider = action.payload.provider
        state.signer = action.payload.signer
        state.name = action.payload.name
        state.chainId = action.payload.chainId
        state.foxcon2022 = action.payload.foxcon2022
        return
      }

      case 'SET_ACCOUNT': {
        state.user = action.payload
        state.isLoading = false
        state.isConnected = true
        return
      }

      case 'CONNECTED_NETWORK': {
        state.chainId = action.payload
        return
      }

      case 'CONNECTED_SIGNER': {
        state.signer = action.payload
        return
      }

      default: break
    }
  }