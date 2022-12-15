import React, { useState } from "react"
import styled from "@emotion/styled"

import { SwipeContainer } from "../SwipeContainer"
import { StepSection } from "components/StepSection"

import { MainNavbar } from "components/MainNavbar"
import ChooseCollection from "../choose-collection"
import ConfigureCollection from "../ConfigureCollection"
import UploadAssets from "../upload-assets"
import AddTraits from "../add-traits"
import ForceAuth from "../ForceAuth"
import { useUser } from "hooks/useAuth"
import { Collection, DefaultCollection } from "types/Collection"
import { saveCollection } from "src/api/collections"
import { v4 as uuidv4 } from "uuid"
import { NFT } from "types/NFT"
import { useMutation } from "react-query"
import { Toast } from "components/ui/Toast"
import { saveNFTsAndAssets } from "src/api/nfts"
import UnicFactoryAbi from "src/abi/UnicFactory.json"
import { addresses } from "constants/addresses"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import { getChain } from "constants/chains"
import { insert } from "utils/format/array"
import { useRouter } from "next/router"
import { signNFT } from "utils/web3/sign"
import { useLazyMintingOptionModal } from "../upload-assets/lazyMintingModal"
import { useMounted } from "hooks/common"

async function getUnicERC1155Address(transactionReceipt: any) {
  const abi = [
    "event ERC1155Deployed(address _contract, address _creator, string _uri, uint256 _royalties);",
  ]
  const _interface = new ethers.utils.Interface(abi)
  // hash of ERC1155Deployed(address,address,string,uint256)
  const topic =
    "0x51af02bd4bf0f605d8c1576d387be351956a5b12769a24b4a5b9b1cdacbc66f5"
  const receipt = await transactionReceipt.wait()
  const event = receipt.logs.find((log: any) => log.topics[0] === topic)
  return _interface.parseLog(event).args[0]
}

export default function CreateNew() {
  const isMounted = useMounted()
  const [step, setStep] = useState(0)
  const { account, chainId, library, active } = useWeb3React()
  const { user } = useUser()
  const authPass = user?.userId && active
  const [editedCollection, setEditedCollection] =
    useState<Collection>(DefaultCollection)
  const [editedNFTs, setEditedNFTs] = useState<Array<NFT>>([])
  const { push } = useRouter()
  const openLazyMintingModal = useLazyMintingOptionModal()

  const { mutate, isLoading } = useMutation(
    ["create_nfts_and_save_assets"],
    async () =>
      await saveNFTsAndAssets({
        nfts: editedNFTs,
        accessToken: user.accessToken,
        userId: user.userId,
        skipMetadataUpload: false,
        assetCreatorAddress: account,
      }),
    {
      onSuccess: () => {
        Toast.success("NFTs created!")
        push("/explore")
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

  const signNFTs = async ({ mintPrice }: { mintPrice: number }) => {
    const signature = await signNFT({
      library,
      maxTokenId: editedNFTs.length - 1,
      minPrice: mintPrice,
      amount: editedNFTs[0].supply,
      chainId,
      contractAddress: editedCollection.address,
    })

    for (var i = 0; i < editedNFTs.length; i++) {
      const nft = { ...editedNFTs[i] }
      if (signature) {
        nft.signature = signature
        nft.mintPrice = mintPrice
        const newNFTs = insert(editedNFTs, nft, i)
        setEditedNFTs(newNFTs)
      } else {
        return
      }
    }
  }

  const createNFTs = async () => {
    if (!validateData()) return

    mutate()
  }

  if (!isMounted) return false
  return (
    <Container>
      <MainNavbar />
      {authPass ? (
        <React.Fragment>
          <StepSection
            steps={[
              "1. Choose a collection",
              "2. Configure the collection",
              "3. Create NFTs",
              "4. Configure properties",
            ]}
            step={step}
            setStep={setStep}
          />
          <SwipeContainer page={step}>
            <ChooseCollection
              isNew={true}
              onClick={async (collection?: Collection) => {
                if (!collection) {
                  setStep(1)
                } else {
                  setEditedCollection(collection)
                  setStep(2)
                }
              }}
            />
            <ConfigureCollection
              isNew
              editedCollection={editedCollection}
              setEditedCollection={setEditedCollection}
              onClick={async (editedCollection: Collection) => {
                const collectionId = uuidv4()

                const collectionContract = new ethers.Contract(
                  addresses[chainId].UNIC_FACTORY_ADDRESS,
                  UnicFactoryAbi,
                  library.getSigner()
                )

                //deploy collection with 2.5% royalty
                const newERC1155Tx = await collectionContract.deployERC1155(
                  `s3://unic-collections/${account}/${collectionId}/{id}.json`,
                  250
                )
                const newERC1155Address = await getUnicERC1155Address(
                  newERC1155Tx
                )

                const newCollection = {
                  ...editedCollection,
                  creatorAddress: account,
                  chain: getChain(chainId).chainTag,
                  address: newERC1155Address,
                  collectionId: collectionId,
                }
                setEditedCollection(newCollection)
                await saveCollection({
                  collection: newCollection,
                  accessToken: user.accessToken,
                  userId: user.userId,
                })
              }}
              onSuccess={() => setStep(2)}
            />
            <UploadAssets
              editedCollection={editedCollection}
              editedNFTs={editedNFTs}
              setEditedNFTs={setEditedNFTs}
              onClick={async () => {
                if (editedNFTs.length == 0) {
                  return Toast.error("Please create at least 1 NFT")
                }

                openLazyMintingModal({
                  callback: async ({ mintPrice, isMinted }) => {
                    try {
                      console.log("WHT: ", {
                        mintPrice,
                        isMinted,
                      })
                      if (!isMinted) {
                        await signNFTs({
                          mintPrice,
                        })
                      }

                      //update isMinted status
                      for (var i = 0; i < editedNFTs.length; i++) {
                        const nft = { ...editedNFTs[i] }
                        nft.isMinted = isMinted
                        const newNFTs = insert(editedNFTs, nft, i)
                        setEditedNFTs(newNFTs)
                      }

                      setStep(3)
                    } catch (err) {
                      Toast.error("Could not sign. Please try again later")
                    }
                  },
                })
              }}
              mintNew
            />
            <AddTraits
              editedNFTs={editedNFTs}
              setEditedNFTs={setEditedNFTs}
              isLoading={isLoading}
              onClick={createNFTs}
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
