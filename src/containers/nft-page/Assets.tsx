import styled from "@emotion/styled"
import EyeIcon, { EyeClosedIcon } from "components/icons/EyeIcon"
import { colors } from "constants/colors"
import Image from "next/image"
import { Asset } from "types/Asset"
import { Collection } from "types/Collection"
import { NFT } from "types/NFT"
import { Media } from "utils/css"
import { useAssetDialog } from "./AssetModal"

export default function Assets({
  assets,
  collectionData,
  nftData,
  refetchAssets,
}: {
  assets: Array<Asset>
  collectionData: Collection
  nftData: NFT
  refetchAssets: any
}) {
  const { useCallback: openAssetModal } = useAssetDialog()

  return (
    <Container>
      <Scroll items={5}>
        {assets?.map((asset, i) => {
          return (
            <Asset
              onClick={() =>
                openAssetModal({
                  asset,
                  collectionData,
                  nftData,
                  refetchAssets,
                })
              }
              key={i}
              asset={asset}
            />
          )
        })}
      </Scroll>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  ${Media.screen("sm")(`
    width: 500px;
  `)}
`

const Scroll = styled.div<{
  items: number
}>`
  display: grid;
  grid-row-gap: 24px;
  grid-template-columns: ${(p) => `repeat(${p.items}, 1fr)`};
  grid-gap: 12px;
  overflow-x: scroll;
`

export function Asset({
  onClick,
  asset,
}: {
  onClick: () => void
  asset: Asset
}) {
  const { assetURL, assetType, visibility } = asset
  return (
    <AssetContainer onClick={onClick}>
      <Image src={assetURL} layout="fill" objectFit="cover"></Image>
      <Label>{assetType}</Label>
      <ViewIconContainer>
        {visibility ? (
          <EyeIcon height={20} width={20} />
        ) : (
          <EyeClosedIcon height={20} width={20} />
        )}
      </ViewIconContainer>
      {visibility ? <EditContainer /> : <Shadow />}
    </AssetContainer>
  )
}

const Label = styled.div`
  font-family: Gilroy;
  display: flex;
  align-items: center;
  color: ${colors.white};
  position: absolute;
  right: 0;
  bottom: 0;
  background: ${colors.black};
  padding: 7px 6px;
  border-radius: 10px 0px 0px 0px;
`

const AssetContainer = styled.div`
  display: inline-block;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 10px;
  background-color: ${colors.gray4};
`

const EditContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
  &:hover {
    background-color: ${colors.black};
    opacity: 0.3;
    transition: 0.2s;
  }
`

const Shadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: ${colors.black};
  opacity: 0.3;
`

const ViewIconContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`
