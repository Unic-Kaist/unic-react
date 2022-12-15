import styled from "@emotion/styled"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import Router from "next/router"

import { switchToDefaultChain } from "utils/walletHelpers"
import { shortenAddress } from "utils/format/shortenAddress"

import { useWalletConnectorDialog } from "./WalletConnector"
import Button from "components/ui/Buttons"

interface Props {
  style?: Object
  callback?: () => void
}

function ConnectButton({ style, callback }: Props) {
  const { account, active, error } = useWeb3React()

  const connectWallet = useWalletConnectorDialog()

  if (active) {
    return (
      <Button
        style={style}
        onClick={() => {
          connectWallet()
          callback ? callback() : null
        }}
      >
        {shortenAddress(account)}
      </Button>
    )
  }

  if (error instanceof UnsupportedChainIdError) {
    return (
      <Button
        style={style}
        onClick={() => {
          switchToDefaultChain()
          callback ? callback() : null
        }}
      >
        Switch Chain
      </Button>
    )
  }

  return (
    <Button
      style={style}
      onClick={() => {
        connectWallet()
        callback ? callback() : null
      }}
    >
      Connect Wallet
    </Button>
  )
}

export default ConnectButton
