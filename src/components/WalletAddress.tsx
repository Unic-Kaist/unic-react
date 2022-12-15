import styled from "@emotion/styled"

import { Text } from "components/ui"
import { Chain } from "constants/chains"
import { colors } from "constants/colors"
import Image from "next/image"
import EthereumIcon from "./icons/EthereumIcon"

interface Props {
  address: string
  chain: Chain
}
export default function WalletAddress({ address, chain }: Props) {
  return (
    <Container>
      <Image src={chain?.icon} width={25} height={25} />
      <Text color={colors.gray1} size={20}>
        {address && address != "" ? address : "--"}
      </Text>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  gap: 10px;
`
