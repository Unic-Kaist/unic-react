import React, { useEffect, useState } from "react"

import { ExternalProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"

import { DEFAULT_CHAIN_ID, getChain } from "constants/chains"
import {
  useEagerConnect,
  useInactiveListener,
} from "hooks/useExistingWalletConnector"
import { useUser } from "hooks/useAuth"

export function Web3Manager({ children }: { children: React.ReactNode }) {
  const { connector, active, deactivate, library, chainId } = useWeb3React()

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  useEffect(() => {
    if (!library) {
      return
    }

    //auto switch chain if on different chain
    // ;(async () => {
    //   const chainInfo = getChain(DEFAULT_CHAIN_ID)
    //   const provider = library.provider as ExternalProvider
    //   await switchChain(provider, chainInfo.chainId, chainInfo)
    // })()
  }, [library, active])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(triedEager)

  return <>{children}</>
}
