import styled from "@emotion/styled"
import { useAuthDialog } from "components/auth"
import { Spacing } from "components/layout"
import { Text } from "components/ui"
import Button from "components/ui/Buttons"
import { useWalletConnectorDialog } from "components/wallet/WalletConnector"
import { colors } from "constants/colors"
import { useUser } from "hooks/useAuth"

export default function ForceAuth() {
  const { user } = useUser()
  const openAuth = useAuthDialog()
  const openWalletConnector = useWalletConnectorDialog()

  return (
    <Container>
      <Center>
        <Text
          font="Gilroy"
          weight="700"
          size={32}
          lineHeight={38}
          color={colors.black}
        >
          {!user?.userId ? "Let's get started!" : "Wallet not connected"}
        </Text>
        <Spacing height={20} />
        <Text font="Gilroy" weight="600" size={22} color={colors.gray1}>
          {!user?.userId
            ? "Please sign up to continue!"
            : "Please connect your wallet to continue!"}
        </Text>
        <Spacing height={56} />
        <StyledButton
          onClick={() => {
            {
              !user?.userId ? openAuth() : openWalletConnector()
            }
          }}
        >
          {!user?.userId ? "Sign In / Sign Up" : "Connect"}
        </StyledButton>
      </Center>
    </Container>
  )
}

export enum OptionStandardType {
  NEW = "new",
  EXISTING = "existing",
}

const Container = styled.div`
  width: 100%;
  max-width: 1248px;
  margin: 0 auto;
`

const Center = styled.div`
  height: calc(100vh - 156px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const StyledButton = styled(Button)`
  max-width: 790px;
  width: 100%;
`
