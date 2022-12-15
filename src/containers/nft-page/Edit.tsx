import React, { useEffect, useState } from "react"
import CollectionEdit from "components/CollectionEdit"
import { MainNavbar } from "components/MainNavbar"
import { Input, Spacing, Text, TextArea, TextButton } from "components/ui"
import styled from "@emotion/styled"
import { Collection } from "types/Collection"
import { queryCollection, saveCollection } from "api/collections"
import { Path } from "utils/url"
import { useMutation, useQuery } from "react-query"
import { DefaultNFT, NFT } from "types/NFT"
import { queryNFTById, updateNFT } from "api/nfts"
import Button from "components/ui/Buttons"
import { Toast } from "components/ui/Toast"
import { useUser } from "hooks/useAuth"
import { useWeb3React } from "@web3-react/core"
import { queryIsCreatorOrOwner } from "./utils"

export default function EditNFT() {
  const { user } = useUser()
  const [editedNFT, setEditedNFT] = useState<NFT>(DefaultNFT)
  const { account, chainId } = useWeb3React()
  const id = Path.get("id")

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

  useEffect(() => {
    if (nftData?.collectionId) {
      setEditedNFT(nftData)
    }
  }, [nftData])

  const { mutate, isLoading: editLoading } = useMutation(
    ["nft_edit"],
    async () => {
      const isOwnerOrCreator = await queryIsCreatorOrOwner({
        nftData,
        collectionData,
        account,
        chainId,
      })
      if (!isOwnerOrCreator) throw Error("Not owner or creator")

      const { nftId, name, description, marketplaceURL } = editedNFT
      await updateNFT({
        nftId,
        name,
        description,
        marketplaceURL,
        accessToken: user.accessToken,
        userId: user.userId,
      })
    },
    {
      onSuccess: () => {
        Toast.success("NFT edited!")
      },
      onError: (error: any) => {
        Toast.error(
          error.message
            ? error.message
            : "Could not edit nft. Please try again later."
        )
        console.log("nft_edit error: ", error)
      },
    }
  )

  return (
    <React.Fragment>
      <MainNavbar />
      <Spacing height={40} />
      <TitleContainer>
        <Text weight={700} size={25}>
          Edit your NFT
        </Text>
      </TitleContainer>
      <Spacing height={20} />
      <DetailsContainer>
        <DetailsContent>
          <Input
            value={editedNFT.name}
            onChange={(e) => {
              setEditedNFT({
                ...editedNFT,
                name: e.target.value,
              })
            }}
            title="Name"
            label="Display name of this NFT on Unic."
            size={20}
            placeholder="https://opensea.io/handler"
          />
          <TextArea
            value={editedNFT?.description}
            onChange={(e) => {
              setEditedNFT({
                ...editedNFT,
                description: e.target.value,
              })
            }}
            title="Description"
            label={
              <span>
                The description will be included in this collection’s detail
                page underneath the image.
                <TextButton size={15}>Markdown syntax</TextButton> is supported.
              </span>
            }
            placeholder="Provide a detailed description about this collection."
          />
          <Input
            value={editedNFT.marketplaceURL}
            onChange={(e) => {
              setEditedNFT({
                ...editedNFT,
                marketplaceURL: e.target.value,
              })
            }}
            title="Marketplace"
            label="This is the default marketplace that your listed NFT will be directed to. (Optional)"
            size={20}
            placeholder="https://opensea.io/handler"
          />
          <Button
            loading={collectionLoading || nftLoading || editLoading}
            onClick={() => mutate()}
          >
            Edit
          </Button>
        </DetailsContent>
      </DetailsContainer>
      <Spacing height={30} />
    </React.Fragment>
  )
}

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const DetailsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

const DetailsContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  padding: 0px 24px;
  gap: 25px;
`
