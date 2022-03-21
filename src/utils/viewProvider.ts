import { createContext, useEffect, useCallback } from 'react'
import { useImmerReducer } from 'use-immer'
import { ethers } from 'ethers'
import { reducer } from './reducers/reducer'
import { initialState } from './initialState.js'


export const ViewContext = createContext(initialState)

//utils
export const bigNumberify = (amt) => {
  return ethers.utils.parseEther(amt)
}
export const smolNumberify = (amt, decimals = 18) => {
  return parseFloat(ethers.utils.formatUnits(amt, decimals))
}
//utils

export const ViewProvider = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState)
  const foxcon2022Address = process.env.REACT_APP_CONTRACT_ADDRESS

  const setAccount = useCallback(async (accounts) => {
    if (accounts.length > 0) {
      try {
        const connectedAccount = {
          address: accounts[0],
        }
        dispatch({ type: 'SET_ACCOUNT', payload: connectedAccount })
      } catch (e) {
        console.error(e)
      }
    } else {
      dispatch({ type: 'SET_ACCOUNT', payload: initialState.user })
    }
  }, [dispatch])

  const connectUser = useCallback(async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      if (provider) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        setAccount(accounts)
    
      }
    } catch (e) {
      console.log(e)
    }
  }, [setAccount, dispatch])

  useEffect(() => {
    if (window.ethereum) {
      connectUser()
      window.ethereum.on('accountsChanged', () => {
        connectUser()
      })
      window.ethereum.on('chainChanged', () => {
        connectUser()
      })
      window.ethereum.on('disconnect', () => {
        dispatch({ type: 'SET_ACCOUNT', payload: initialState.user })
      })
    }
  }, [connectUser, dispatch])

  const { isConnected, name, user } = state

  const connect = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <ViewContext.Provider
      value={
        state,
        isConnected,
        provider,
        signer,
        user,
        name,
        chainId,
        actions: { connect }
      }>
      {children}
    </ViewContext.Provider>
  )
}