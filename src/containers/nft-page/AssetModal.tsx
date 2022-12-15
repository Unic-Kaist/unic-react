import { ReactNode, useCallback } from "react"

import styled from "@emotion/styled"
import { useModal } from "hooks/useModal"
import { Asset } from "types/Asset"
import Image from "next/image"
import { Divider, Text } from "components/ui"
import { colors } from "constants/colors"
import InfoIcon from "components/icons/InfoIcon"
import { useMutation, useQuery } from "react-query"
import { NFT, NFTUserRelation } from "types/NFT"
import { queryNFTById } from "api/nfts"
import Button from "components/ui/Buttons"
import { Collection } from "types/Collection"
import { queryIsCreatorOrOwner } from "./utils"
import { useWeb3React } from "@web3-react/core"
import { chainIdByTag } from "constants/chains"
import { Media } from "utils/css"
import { updateAsset } from "api/assets"
import { Toast } from "components/ui/Toast"
import { useUser } from "hooks/useAuth"
import { saveAs } from "file-saver"

export function useAssetDialog() {
  const { open, close } = useModal()
  return {
    useCallback: useCallback(
      ({
        asset,
        collectionData,
        nftData,
        refetchAssets,
        viewOnly,
        children,
      }: {
        asset: Asset
        collectionData: Collection
        nftData: NFT
        refetchAssets?: any
        viewOnly?: boolean
        children?: ReactNode
      }) => {
        open(
          <AssetModal
            asset={asset}
            collectionData={collectionData}
            nftData={nftData}
            refetchAssets={refetchAssets}
            viewOnly={viewOnly}
            close={close}
          >
            {children}
          </AssetModal>
        )
      },
      [open, close]
    ),
    open,
    close,
  }
}

function AssetModal({
  asset,
  collectionData,
  nftData,
  refetchAssets,
  viewOnly,
  children,
  close,
}: {
  asset: Asset
  collectionData: Collection
  nftData: NFT
  refetchAssets?: any
  viewOnly?: boolean
  children?: ReactNode
  close?: () => void
}) {
  const { user } = useUser()
  const { account } = useWeb3React()
  const processedText = ["Unprocessed", "Processing", "Processed"]

  const {
    data: isCreatorOrOwner,
    isLoading: isCreatorOrOwnerLoading,
  }: {
    data: boolean
    isLoading: boolean
  } = useQuery(
    account &&
      collectionData?.collectionId &&
      nftData?.tokenId && [
        "query_is_creator_or_owner",
        collectionData?.collectionId && nftData?.tokenId && account,
      ],
    async () => {
      return await queryIsCreatorOrOwner({
        nftData,
        collectionData,
        account,
        chainId: chainIdByTag[collectionData?.chain],
      })
    }
  )

  const { mutate: mutateAsset, isLoading: isAssetMutateLoading } = useMutation(
    asset?.assetId &&
      user?.userId && ["update_asset", asset?.assetId && user?.userId],
    async () => {
      await updateAsset({
        assetId: asset?.assetId,
        visibility: asset?.visibility ? false : true,
        userId: user?.userId,
        accessToken: user?.accessToken,
      })
    },
    {
      onSuccess: () => {
        refetchAssets()
        close()
        Toast.success("Asset visibility updated!")
      },
      onError: (error: any) => {
        Toast.error(
          error.message
            ? error.message
            : "Could not update asset. Please try again later"
        )
        console.log("update_asset error: ", error)
      },
    }
  )

  return (
    <Container>
      <Img src={asset.assetURL} />

      <DetailsContainer>
        <TitleContainer>
          <InfoIcon width={30} height={30}></InfoIcon>
          <Text weight={700} size={25}>
            Asset
          </Text>
        </TitleContainer>
        <Divider width="100%" height={1} color={colors.gray3}></Divider>
        <RowContainer>
          <Row>
            <Text>Visibility:</Text>
            <Text weight={600}>{asset?.visibility ? "visible" : "hidden"}</Text>
          </Row>
          <Row>
            <Text>Signature Processed:</Text>
            <Text weight={600}>{processedText[asset?.processed || 0]}</Text>
          </Row>
          <Row>
            <Text>Represents:</Text>
            <Text style={{ textAlign: "right" }} weight={600}>
              {nftData?.name}
            </Text>
          </Row>
          <Row>
            <Text>Creator:</Text>
            <Text weight={600}>{`${asset?.creatorAddress.slice(
              0,
              5
            )} ... ${asset?.creatorAddress.slice(
              asset?.creatorAddress.length - 5,
              asset?.creatorAddress.length
            )}`}</Text>
          </Row>
          <Row>
            <Text>Type:</Text>
            <Text weight={600}>{asset?.assetType}</Text>
          </Row>
        </RowContainer>
        {!viewOnly && (
          <ButtonContainer>
            {isCreatorOrOwner ? (
              <Button
                loading={isCreatorOrOwnerLoading}
                onClick={() =>
                  saveAs(asset?.assetURL, `${nftData?.name}_asset.png`)
                }
              >
                Download
              </Button>
            ) : null}
            {isCreatorOrOwner ? (
              <Button
                loading={isCreatorOrOwnerLoading || isAssetMutateLoading}
                theme="secondary"
                onClick={() => mutateAsset()}
              >
                {asset?.visibility ? "Hide Asset" : "Unhide Asset"}
              </Button>
            ) : null}
          </ButtonContainer>
        )}
        {children}
      </DetailsContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-top: 20px;
  scroll: auto;
  ${Media.screen("lg")(`
    flex-direction: row;
    padding-top: 0px;
  `)}
`

const Img = styled.img`
  max-width: 500px;
  height: undefined;
`

const DetailsContainer = styled.div`
  min-width: 400px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const TitleContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px 20px 0px 20px;
`

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0px 20px 20px 20px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
`

export default AssetModal
