import styled from "@emotion/styled"
import { useWeb3React } from "@web3-react/core"
import AddCircleIcon from "components/icons/AddCircleIcon"
import EyeIcon from "components/icons/EyeIcon"
import ScanIcon from "components/icons/ScanIcon"
import InfoTab from "components/InfoTab"
import { MainNavbar } from "components/MainNavbar"
import { Spacing, Text } from "components/ui"
import Button from "components/ui/Buttons"
import { chainIdByTag } from "constants/chains"
import { colors } from "constants/colors"
import { useUser } from "hooks/useAuth"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useQuery } from "react-query"
import { queryAssetsByNFTId } from "src/api/assets"
import { queryCollection } from "src/api/collections"
import { incrementNFTViewCount, queryNFTById } from "src/api/nfts"
import { Collection } from "types/Collection"
import { NFT } from "types/NFT"
import { Media } from "utils/css"
import { safeLocalStorage } from "utils/storage"
import { Path } from "utils/url"
import Assets from "./Assets"
import Details from "./Details"
import NFTPhoto from "./NFTPhoto"
import { queryIsCreatorOrOwner } from "./utils"

export default function NFTPage() {
  const id = Path.get("id")
  const { push } = useRouter()
  const { account, chainId } = useWeb3React()
  const { user } = useUser()

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

  const {
    data: assetsData,
    isLoading: assetsLoading,
    refetch: refetchAssets,
  } = useQuery(
    nftData?.nftId && ["query_assets_by_nft_id", nftData?.nftId],
    async () => {
      return await queryAssetsByNFTId(nftData?.nftId)
    }
  )

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

  async function incrementView() {
    const key = `viewed_${nftData?.nftId}`

    if (!safeLocalStorage.get(key)) {
      console.log("UPDATE? ", safeLocalStorage.get(key))
      try {
        await incrementNFTViewCount({
          nftId: nftData?.nftId,
          accessToken: user?.accessToken,
          userId: user?.userId,
        })
        safeLocalStorage.set(key, JSON.stringify(true))
      } catch {}
    }
  }

  useEffect(() => {
    incrementView()
  }, [nftData?.nftId])

  const isLoading = collectionLoading || nftLoading || isCreatorOrOwnerLoading

  return (
    <Container>
      <MainNavbar />
      <InnerContainer>
        <Center>
          <Section1>
            <NFTPhoto nft={nftData} />
            <PeggedAssetsContainer>
              <AssetsTitleContainer>
                <Text size={25} weight={700}>
                  Pegged Assets
                </Text>
                {isCreatorOrOwner && (
                  <CreateAssetsButton
                    onClick={() => push(`/nft/create-assets/${nftData?.nftId}`)}
                  >
                    <Text size={20} weight={600}>
                      Create New
                    </Text>
                    <AddCircleIcon width={20} height={20} />
                  </CreateAssetsButton>
                )}
              </AssetsTitleContainer>
              <Spacing height={20} />
              <Assets
                assets={assetsData}
                collectionData={collectionData}
                nftData={nftData}
                refetchAssets={refetchAssets}
              />
              <Spacing height={20} />
            </PeggedAssetsContainer>
          </Section1>
          <Section2>
            <TitleContainer>
              <Text>
                Created by{" "}
                <Text color={colors.primary.color} weight={700}>
                  {nftData?.creatorAddress
                    ? nftData?.creatorAddress?.slice(0, 10) + " ..."
                    : "--"}
                </Text>
              </Text>
              <Text size={40} weight={700}>
                {nftData?.name}
              </Text>
              <Text>
                Owned by{" "}
                <Text color={colors.primary.color} weight={700}>
                  {nftData?.ownerAddress
                    ? nftData?.ownerAddress?.slice(0, 10) + " ..."
                    : "--"}
                </Text>
              </Text>
            </TitleContainer>
            <Text>{nftData?.description}</Text>
            <TabsContainer>
              <InfoTab
                title="Views"
                content={nftData?.viewCount ? nftData?.viewCount : 0}
                icon={<EyeIcon width={30} height={30} />}
              />
              <InfoTab
                title="Scans"
                content={nftData?.scanCount ? nftData?.scanCount : 0}
                icon={<ScanIcon width={17} height={17} />}
              />
            </TabsContainer>
            <ButtonContainer>
              {nftData?.marketplaceURL ? (
                <Button
                  loading={isLoading}
                  onClick={() => {
                    push(nftData?.marketplaceURL)
                  }}
                >
                  Go to Marketplace
                </Button>
              ) : null}
              {isCreatorOrOwner ? (
                <Button
                  loading={isLoading}
                  theme="secondary"
                  onClick={() => {
                    push(`/nft/edit/${nftData?.nftId}`)
                  }}
                >
                  Edit NFT
                </Button>
              ) : null}
            </ButtonContainer>
            <Details collection={collectionData} nft={nftData} />
          </Section2>
        </Center>
      </InnerContainer>
    </Container>
  )
}

const InnerContainer = styled.div`
  ${Media.screen("md")(`
    display: flex;
    align-items: center;
    justify-content: center;
  `)}
`

const Container = styled.div``

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`

const AssetsTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CreateAssetsButton = styled.div`
  display: flex;
  gap: 7px;
  align-items: center;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
    transition: 200ms;
  }
`

const Center = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 40px 40px 40px;
  ${Media.screen("md")(`
    flex-direction: row;
    gap: 50px
  `)}
  max-width: 1000px;
`

const Section1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 30px;
`

const Section2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  min-width: 400px;
  gap: 30px;
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
`

const PeggedAssetsContainer = styled.div`
  width: 100%;
`

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
`
