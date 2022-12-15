import { useState, useEffect } from "react"

import { useWeb3React } from "@web3-react/core"

import { injected } from "connectors/connectors"
import { isSupportedChain } from "constants/chains"
import { useUser } from "./useAuth"

export function useEagerConnect() {
  const { user } = useUser()
  const { activate, deactivate, active, chainId } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (!user?.userId) return
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!user?.userId) return
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  useEffect(() => {
    if (!user?.userId) return
    if (!isSupportedChain(chainId)) {
      deactivate()
    }
  }, [chainId])

  return tried
}

export function useInactiveListener(suppress: boolean = false) {
  const { user } = useUser()
  const { active, error, activate, deactivate } = useWeb3React()

  useEffect((): any => {
    if (!user?.userId) return
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !suppress) {
      const handleConnect = () => {
        console.log("'connect' event")
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log("'chainChanged' event with payload", chainId)
        window.location.reload()
        deactivate()
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          deactivate()
        }
      }
      const handleNetworkChanged = (chainId: string | number) => {
        console.log("'networkChanged' event with payload", chainId)
        window.location.reload()
        deactivate()
      }

      ethereum.on("connect", handleConnect)
      ethereum.on("chainChanged", handleChainChanged)
      ethereum.on("accountsChanged", handleAccountsChanged)
      ethereum.on("networkChanged", handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect)
          ethereum.removeListener("chainChanged", handleChainChanged)
          ethereum.removeListener("accountsChanged", handleAccountsChanged)
          ethereum.removeListener("networkChanged", handleNetworkChanged)
        }
      }
    }
  }, [active, error, suppress, activate])
}
