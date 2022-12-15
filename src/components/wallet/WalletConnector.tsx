import { useCallback, useEffect, useRef } from "react"

import { useModal } from "hooks/useModal"
import styled from "@emotion/styled"
import { Text } from "components/ui"
import Button, { TextButton } from "components/ui/Buttons"
import { colors } from "constants/colors"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { injected, walletconnect } from "connectors/connectors"
import { Toast } from "components/ui/Toast"
import axios from "axios"
import { getChain, isSupportedChain } from "constants/chains"
import { useUser } from "hooks/useAuth"
import { switchToDefaultChain } from "utils/walletHelpers"
import { saveWallet } from "api/wallets"
import { useBrowsingChain } from "hooks/useBrowsingChain"

export function useWalletConnectorDialog() {
  const { open, close } = useModal()
  return useCallback(() => {
    open(<WalletConnectorModal onClose={close} />)
  }, [open, close])
}

function WalletConnectorModal({ onClose }: { onClose: () => void }) {
  const { activate, deactivate, active, account, chainId, error } =
    useWeb3React()
  const { user } = useUser()
  const { setBrowsingChainId } = useBrowsingChain()

  const ref = useRef(account)
  useEffect(() => {
    if (ref.current != account && account) {
      setBrowsingChainId(chainId)
      saveWallet({
        address: account,
        chainId,
        userId: user.userId,
        accessToken: user.accessToken,
      })
      Toast.success("Connected")
      onClose()
    }

    ref.current = account
  }, [account])

  const isChainValid = active
    ? isSupportedChain(chainId)
    : error instanceof UnsupportedChainIdError
    ? false
    : true

  return (
    <Container>
      <TextContainer>
        <Text weight={700} size={25}>
          {!isChainValid
            ? "Unsupported chain"
            : !active
            ? "Connect your wallet"
            : "Disconnect"}
        </Text>
        <Text weight={600} size={17} color={colors.gray2}>
          {!isChainValid
            ? "Please switch to a supported chain."
            : !active
            ? "Connect with one of your external wallets."
            : "Disconnect from wallet."}
        </Text>
      </TextContainer>
      <ButtonsContainer>
        <Button
          onClick={async () => {
            if (!isChainValid) {
              await switchToDefaultChain()
            } else if (!active) {
              const auth = await injected.isAuthorized()
              await activate(injected)
            } else {
              await deactivate()
            }
          }}
        >
          {!isChainValid ? "Switch Chain" : !active ? "Connect" : "Disconnect"}
        </Button>
        <TextButton>Learn More</TextButton>
      </ButtonsContainer>
    </Container>
  )
}

const Container = styled.div`
  max-width: 400px;
  width: 70vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 10px;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 10px;
`
