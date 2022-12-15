import { useState } from "react"

import styled from "@emotion/styled"
import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"

import { Spacing } from "components/layout"
import { Text } from "components/ui"
import Button from "components/ui/Buttons"
import { colors } from "constants/colors"

import { OptionCard } from "./OptionCard"

export default function SelectOptionPage() {
  const { push } = useRouter()
  const [type, setType] = useState<OptionStandardType>(OptionStandardType.NEW)
  const { account, activate } = useWeb3React()

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
          Choose a pool Standard
        </Text>
        <Spacing height={48} />
        <CenterVertical>
          <OptionCard
            checked={type == OptionStandardType.NEW}
            onClick={() => setType(OptionStandardType.NEW)}
            title="Create New Pegged NFT"
            subtitle="Mint a new pegged NFT"
            description="You can create a new NFT backed by an asset such as a digital image, an audio file, or a video, using our smart contract."
          />
          <Spacing width={24} />
          <OptionCard
            checked={type == OptionStandardType.EXISTING}
            onClick={() => setType(OptionStandardType.EXISTING)}
            title="Use Existing NFT"
            subtitle="Upgrade your NFT to pegged NFT"
            description="You can invisible watermark any asset, such as a digital image, an audio file, or a video to an NFT you already own."
          />
        </CenterVertical>
        <Spacing height={56} />
        <StyledButton onClick={() => push(`/create/${type}`)}>
          Next
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

const CenterVertical = styled.div`
  display: flex;
  align-items: center;
`

const StyledButton = styled(Button)`
  max-width: 790px;
  width: 100%;
`
