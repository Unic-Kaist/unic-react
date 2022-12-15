import React, { useState } from "react"

import styled from "@emotion/styled"

import { SwipeContainer } from "../SwipeContainer"
import { StepSection } from "components/StepSection"

import { MainNavbar } from "components/MainNavbar"
import ChooseCollection from "../choose-collection"
import UploadAssets from "../upload-assets"
import ConfigureCollection from "../ConfigureCollection"
import ForceAuth from "../ForceAuth"
import { useWeb3React } from "@web3-react/core"
import { useUser } from "hooks/useAuth"
import { useMounted } from "hooks/common"
import {
  queryCollection,
  queryCollectionOwner,
  saveCollection,
} from "src/api/collections"
import { Collection, DefaultCollection } from "types/Collection"
import { NFT } from "types/NFT"
import { useMutation } from "react-query"
import { saveNFTsAndAssets } from "api/nfts"
import { Toast } from "components/ui/Toast"
import { useRouter } from "next/router"

export default function CreateExisting() {
  const mounted = useMounted()
  const [step, setStep] = useState(0)
  const { account, active } = useWeb3React()
  const { user } = useUser()
  const { push } = useRouter()
  const [editedCollection, setEditedCollection] =
    useState<Collection>(DefaultCollection)
  const [editedNFTs, setEditedNFTs] = useState<Array<NFT>>([])
  const authPass = user?.userId && active

  const { mutate, isLoading } = useMutation(
    ["create_nfts_and_save_assets"],
    async () => {
      validateData()
      await saveNFTsAndAssets({
        nfts: editedNFTs,
        accessToken: user.accessToken,
        userId: user.userId,
        skipMetadataUpload: true,
        assetCreatorAddress: account,
      })
    },
    {
      onSuccess: () => {
        Toast.success("NFTs saved!")
        push("/explore")
      },
      onError: (error) => {
        Toast.error("Could not save nfts. Please try again later.")
      },
    }
  )

  const validateData = () => {
    let totalAssetCount = 0
    for (var i = 0; i < editedNFTs.length; i++) {
      const nft = editedNFTs[i]
      if (nft.assets.length <= 0) {
        Toast.error("Please have at least one scannable asset per NFT")
        return false
      } else {
        totalAssetCount += nft.assets.length
      }
    }

    if (totalAssetCount > 100) {
      Toast.error("You can only mint up to 100 invisible signatures at once")
      return false
    }

    return true
  }

  const createNFTs = async () => {
    if (!validateData()) return
    mutate()
  }

  if (!mounted) return null
  return (
    <Container>
      <MainNavbar />
      {authPass ? (
        <React.Fragment>
          <StepSection
            steps={[
              "1. Choose a collection",
              "2. Configure the collection",
              "3. Upload assets",
            ]}
            step={step}
            setStep={setStep}
          />
          <SwipeContainer page={step}>
            <ChooseCollection
              isNew={false}
              onClick={async (collection?: Collection) => {
                const collectionInfo = await queryCollection(
                  collection.collectionId
                )

                const ownerAddress = await queryCollectionOwner(
                  collection.address
                )

                //if collection is not saved in Unic DB
                if (!collectionInfo?.collectionId) {
                  const newCollection = {
                    collectionId: collection?.collectionId,
                    address: collection?.address,
                    standard: collection?.standard,
                    name: collection?.name,
                    mainPhoto: collection?.mainPhoto
                      ? collection?.mainPhoto
                      : null,
                  }
                  setEditedCollection(newCollection)
                  if (account.toLowerCase() == ownerAddress.toLowerCase()) {
                    //if owner, move to edit collection
                    setStep(1)
                  } else {
                    //if not owner, save collection to db and skip edit collection
                    setStep(2)
                  }
                } else {
                  setEditedCollection(collectionInfo)
                  if (account.toLowerCase() == ownerAddress.toLowerCase()) {
                    //if owner, move to edit collection
                    setStep(1)
                  } else {
                    //if not owner, skip edit collection
                    setStep(2)
                  }
                }
              }}
            />
            <ConfigureCollection
              editedCollection={editedCollection}
              setEditedCollection={setEditedCollection}
            />
            <UploadAssets
              isLoading={isLoading}
              editedCollection={editedCollection}
              editedNFTs={editedNFTs}
              setEditedNFTs={setEditedNFTs}
              onClick={async () => {
                if (editedNFTs.length == 0) {
                  return Toast.error("Please select at least 1 NFT")
                }
                await saveCollection({
                  collection: editedCollection,
                  accessToken: user.accessToken,
                  userId: user.userId,
                })
                await createNFTs()
              }}
            />
          </SwipeContainer>
        </React.Fragment>
      ) : (
        <ForceAuth />
      )}
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`
