import styled from "@emotion/styled"
import { Divider, Spacing, Text } from "components/ui"
import AddCircleIcon from "components/icons/AddCircleIcon"
import { colors } from "constants/colors"
import Button from "components/ui/Buttons"
import { Collection } from "types/Collection"
import React, { useState } from "react"
import { DefaultAsset } from "types/Asset"
import { DefaultNFT, NFT } from "types/NFT"
import { useUploaderDialog } from "components/Uploader"
import { useWeb3React } from "@web3-react/core"
import { v4 as uuidv4 } from "uuid"
import { useMounted } from "hooks/common"
import AddIcon from "components/icons/AddIcon"
import { OptionCard } from "containers/create/choose-option/OptionCard"
import { useMutation, useQuery } from "react-query"
import { Path } from "utils/url"
import { queryNFTById } from "api/nfts"
import { queryCollection } from "api/collections"
import { createAssets, queryAssetsByNFTId } from "api/assets"
import { Asset } from "types/Asset"
import { queryIsCreatorOrOwner } from "./utils"
import { useUser } from "hooks/useAuth"
import { Toast } from "components/ui/Toast"
import { MainNavbar } from "components/MainNavbar"
import Assets, { Asset as AssetComponent } from "./Assets"
import { useAssetDialog } from "./AssetModal"
import { remove } from "utils/format/array"
import ForceAuth from "containers/create/ForceAuth"

export default function CreateAssets() {
  const id = Path.get("id")
  const { account, library, chainId, active } = useWeb3React()
  const { user } = useUser()
  const [newAssets, setNewAssets] = useState<Array<Asset>>([])
  const openUploader = useUploaderDialog()
  const { useCallback: openAssetModal, close } = useAssetDialog()
  const mounted = useMounted()
  const authPass = user?.userId && active

  const {
    data: nftData,
    isLoading: nftLoading,
  }: {
    data: NFT
    isLoading: boolean
  } = useQuery(id && ["query_nft_by_id", id], async () => {
    return await queryNFTById(id)
  })

  const {
    data: collectionData,
    isLoading: collectionLoading,
  }: {
    data: Collection
    isLoading: boolean
  } = useQuery(
    nftData?.collectionId && [
      "query_collection_by_address",
      nftData?.collectionId,
    ],
    async () => {
      return await queryCollection(nftData?.collectionId)
    }
  )

  const { mutate, isLoading: createAssetsLoading } = useMutation(
    ["create_assets"],
    async () => {
      const isOwnerOrCreator = await queryIsCreatorOrOwner({
        nftData,
        collectionData,
        account,
        chainId,
      })
      if (!isOwnerOrCreator) throw Error("Not owner or creator")

      const { nftId } = nftData
      await createAssets({
        nftId,
        assetCreatorAddress: account,
        assets: newAssets,
        accessToken: user?.accessToken,
        userId: user?.userId,
      })
    },
    {
      onSuccess: () => {
        Toast.success("New Assets Created!")
      },
      onError: (error: any) => {
        Toast.error(
          error.message
            ? error.message
            : "Could not save new assets. Please try again later."
        )
        console.log("create_assets error: ", error)
      },
    }
  )

  if (!mounted) return null
  if (!authPass) return <ForceAuth />
  return (
    <React.Fragment>
      <MainNavbar />
      <Spacing height={40} />
      <Container>
        <Header>
          <TitleContainer>
            <Text weight={700} size={25}>
              {`Create New Assets for ${nftData?.name}`}
            </Text>
          </TitleContainer>
          <Spacing height={10} />

          <AddNewContainer
            onClick={() =>
              openUploader({
                multiple: true,
                callback: (urls) => {
                  const newNewAssets: Array<Asset> = []
                  urls.forEach((url) => {
                    newNewAssets.push({
                      ...DefaultAsset,
                      assetId: uuidv4(),
                      assetURL: url,
                      creatorAddress: account,
                      creatorId: user?.userId,
                    })
                  })
                  setNewAssets([...newAssets, ...newNewAssets])
                },
              })
            }
          >
            {newAssets.length > 0 ? (
              <React.Fragment>
                <AddCircleIcon color={colors.gray1} width={28} height={28} />
                <Text weight={600} size={20} color={colors.gray1}>
                  Add New
                </Text>
              </React.Fragment>
            ) : (
              <div>
                <Spacing height={30} />
                <OptionCard
                  icon={<AddIcon color={colors.gray3} width={20} height={20} />}
                  checked={false}
                  title="Create Assets"
                  subtitle="Mint invisible signature."
                  description="You can make images scannable and verifiable as an NFT."
                />
              </div>
            )}
          </AddNewContainer>
        </Header>
        <Scroll>
          <AssetScroll items={5}>
            {newAssets?.map((asset, i) => {
              return (
                <React.Fragment>
                  <AssetComponent
                    onClick={() =>
                      openAssetModal({
                        asset,
                        collectionData,
                        nftData,
                        viewOnly: true,
                        children: (
                          <ButtonContainer>
                            <Button
                              onClick={() => {
                                const newNewAssets = remove(newAssets, i)
                                setNewAssets(newNewAssets)
                                close()
                              }}
                            >
                              Remove
                            </Button>

                            <Button
                              theme="secondary"
                              onClick={() => {
                                const newNewAssets = [...newAssets]
                                const newNewAsset = { ...newAssets[i] }
                                newNewAsset.visibility = !newNewAsset.visibility
                                newNewAssets[i] = newNewAsset
                                setNewAssets(newNewAssets)
                                close()
                              }}
                            >
                              {asset?.visibility
                                ? "Hide Asset"
                                : "Unhide Asset"}
                            </Button>
                          </ButtonContainer>
                        ),
                      })
                    }
                    key={i}
                    asset={asset}
                  />
                </React.Fragment>
              )
            })}
          </AssetScroll>
        </Scroll>
        <Spacing height={20} />
        <StyledButton
          loading={createAssetsLoading || nftLoading || collectionLoading}
          onClick={() => mutate()}
        >
          Create
        </StyledButton>
      </Container>
    </React.Fragment>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1248px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Header = styled.div`
  padding-bottom: 20px;
`

const Scroll = styled.div`
  height: 100%;
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`

const AssetScroll = styled.div<{
  items: number
}>`
  display: grid;
  grid-row-gap: 24px;
  grid-template-columns: ${(p) => `repeat(${p.items}, 1fr)`};
  grid-gap: 12px;
  overflow-x: scroll;
`

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 7px;
`

const AddNewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const StyledButton = styled(Button)`
  max-width: 790px;
  width: 100%;
  margin-bottom: 30px;
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
`
