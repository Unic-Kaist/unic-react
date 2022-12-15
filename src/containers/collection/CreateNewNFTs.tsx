import React, { useEffect, useState } from "react"
import CollectionEdit from "components/CollectionEdit"
import { MainNavbar } from "components/MainNavbar"
import { Spacing, Text } from "components/ui"
import styled from "@emotion/styled"
import { DefaultCollection } from "types/Collection"
import { queryCollection } from "api/collections"
import { Path } from "utils/url"
import { useMutation, useQuery } from "react-query"
import UploadAssets from "containers/create/upload-assets"
import { NFT } from "types/NFT"
import { SwipeContainer } from "containers/create/SwipeContainer"
import { StepSection } from "components/StepSection"
import AddTraits from "containers/create/add-traits"
import { Toast } from "components/ui/Toast"
import { saveNFTsAndAssets } from "api/nfts"
import { useUser } from "hooks/useAuth"
import { useRouter } from "next/router"
import { insert } from "utils/format/array"
import { signNFT } from "utils/web3/sign"
import { useWeb3React } from "@web3-react/core"

export default function CreateNewNFTs() {
  const [editedCollection, setEditedCollection] = useState(DefaultCollection)
  const [editedNFTs, setEditedNFTs] = useState<Array<NFT>>([])
  const { account, chainId, library } = useWeb3React()
  const [step, setStep] = useState(0)
  const { user } = useUser()
  const { push } = useRouter()
  const id = Path.get("id")

  const { data: collectionData, isLoading: collectionLoading } = useQuery(
    id && ["query_collection_by_id", id],
    async () => {
      return await queryCollection(id)
    }
  )

  useEffect(() => {
    if (collectionData?.collectionId) {
      setEditedCollection(collectionData)
    }
  }, [collectionData])

  const { mutate, isLoading: saveLoading } = useMutation(
    ["create_nfts_and_save_assets"],
    async () =>
      await saveNFTsAndAssets({
        nfts: editedNFTs,
        accessToken: user.accessToken,
        userId: user.userId,
        skipMetadataUpload: true,
        assetCreatorAddress: account,
      }),
    {
      onSuccess: () => {
        Toast.success("NFTs created!")
        push(`/collection/${collectionData?.collectionId}`)
      },
      onError: (error) => {
        Toast.error("Could not create nfts. Please try again later.")
      },
    }
  )

  const validateData = () => {
    let totalAssetCount = 0
    for (var i = 0; i < editedNFTs.length; i++) {
      const nft = editedNFTs[i]
      totalAssetCount += nft.assets.length
    }

    if (totalAssetCount + editedNFTs.length > 100) {
      Toast.error("You can only mint up to 100 invisible signatures at once")
      return false
    }

    return true
  }

  const createNFTs = async () => {
    if (!validateData()) return

    const signature = await signNFT({
      library,
      maxTokenId: editedNFTs.length - 1,
      //TODO: Amount and minPrice needs attention
      minPrice: 100000,
      amount: 1,
      chainId,
      contractAddress: editedCollection?.address,
    })

    for (var i = 0; i < editedNFTs.length; i++) {
      const nft = { ...editedNFTs[i] }
      if (signature) {
        nft.signature = signature
        const newNFTs = insert(editedNFTs, nft, i)
        setEditedNFTs(newNFTs)
      } else {
        return
      }
    }

    mutate()
  }

  return (
    <React.Fragment>
      <MainNavbar />
      <Spacing height={20} />
      <React.Fragment>
        <StepSection
          steps={["1. Configure NFTs", "2. Configure Traits"]}
          step={step}
          setStep={setStep}
        />
        <SwipeContainer page={step}>
          <UploadAssets
            editedCollection={editedCollection}
            editedNFTs={editedNFTs}
            setEditedNFTs={setEditedNFTs}
            onClick={() => setStep(1)}
            mintNew
          />
          <AddTraits
            editedNFTs={editedNFTs}
            setEditedNFTs={setEditedNFTs}
            isLoading={collectionLoading || saveLoading}
            onClick={createNFTs}
          />
        </SwipeContainer>
      </React.Fragment>
    </React.Fragment>
  )
}
