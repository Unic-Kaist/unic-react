import styled from "@emotion/styled"
import { useCallback, useState } from "react"

import { useModal } from "hooks/useModal"
import { Input, Select, Text } from "components/ui"
import Button from "components/ui/Buttons"
import { colors } from "constants/colors"

export function useLazyMintingOptionModal() {
  const { open, close } = useModal()
  return useCallback(
    ({
      callback,
    }: {
      callback: ({
        isMinted,
        mintPrice,
      }: {
        isMinted: boolean
        mintPrice: number
      }) => Promise<void>
    }) => {
      open(<LazyMintingOptionModal onClose={close} callback={callback} />)
    },
    [open]
  )
}

function LazyMintingOptionModal({
  onClose,
  callback,
}: {
  onClose: () => void
  callback: ({
    isMinted,
    mintPrice,
  }: {
    isMinted: boolean
    mintPrice: number
  }) => Promise<void>
}) {
  const [isMinted, setIsMinted] = useState<boolean>(false)
  const [mintPrice, setMintPrice] = useState<number>(0)
  return (
    <Container>
      <Text weight={700} size={25}>
        Configure Minting
      </Text>
      <Text weight={600} size={17} color={colors.gray2}>
        Add a trait for this collection. (ex. Eyes, Hairstyle)
      </Text>
      <Select
        value={
          isMinted
            ? BOOLEAN_BY_TYPE[BooleanType.TRUE]
            : BOOLEAN_BY_TYPE[BooleanType.FALSE]
        }
        onChange={(value) => {
          setIsMinted(value.id == BooleanType.TRUE)
        }}
        title="Create for free (Lazy Mint)"
        label="Do you want to skip minting for now?"
        options={Object.keys(BooleanType).map((id: BooleanType) => ({
          id,
          name: BOOLEAN_BY_TYPE[id],
        }))}
        placeholder="Requires shipping"
      />
      {!isMinted && (
        <Input
          type="number"
          value={mintPrice}
          onChange={(e) => {
            setMintPrice(parseFloat(e.target.value))
          }}
          title="Mint Price in ETH"
          label="This is the price in ETH people will pay to mint each NFT"
          size={20}
          placeholder="0.0 ETH"
        />
      )}
      <Button
        onClick={async () => {
          await callback({
            isMinted,
            mintPrice,
          })
          onClose()
        }}
      >
        Continue
      </Button>
    </Container>
  )
}

const Container = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export enum BooleanType {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

const BOOLEAN_BY_TYPE = {
  [BooleanType.TRUE]: "Yes",
  [BooleanType.FALSE]: "No",
}
