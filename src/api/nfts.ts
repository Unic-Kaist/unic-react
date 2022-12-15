import axios from "axios"
import { getBackendEndpoint } from "constants/apis"
import { getChain } from "constants/chains"
import { ethers } from "ethers"
import { NFT } from "types/NFT"
import { getProvider } from "utils/web3/provider"

export async function queryERC721Owner({
  collectionAddress,
  tokenId,
  chainId,
}: {
  collectionAddress: string
  tokenId: number
  chainId?: number
}): Promise<string> {
  const ownerOfAbi = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
  ]

  const provider = getProvider(chainId)

  const collectionContract = new ethers.Contract(
    collectionAddress,
    ownerOfAbi,
    provider
  )

  try {
    return await collectionContract.ownerOf(tokenId)
  } catch {
    return ""
  }
}

export async function queryERC1155Balance({
  collectionAddress,
  ownerAddress,
  tokenId,
  chainId,
}: {
  collectionAddress: string
  ownerAddress: string
  tokenId: number
  chainId?: number
}): Promise<number> {
  const balanceOfAbi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ]

  const provider = getProvider(chainId)

  const collectionContract = new ethers.Contract(
    collectionAddress,
    balanceOfAbi,
    provider
  )

  try {
    return await collectionContract.balanceOf(ownerAddress, tokenId)
  } catch {
    return 0
  }
}

export async function queryNFTsByCollectionId(collectionId: string) {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`query_nfts_by_collection_id/${collectionId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error("server message error")
    }
  } catch (err) {
    console.log("failed queryNFTsByCollectionId: ", err)
    throw Error()
  }
}

export async function queryNFTById(nftId: string) {
  try {
    const { data } = await axios.get(getBackendEndpoint(`query_nft/${nftId}`))
    if (data.success) {
      return data.data
    } else {
      throw Error("server message error")
    }
  } catch (err) {
    console.log("failed queryNFTById: ", err)
    throw Error()
  }
}

export async function queryNFTsByAddressesAndTokenIds(
  params: Array<{
    collectionAddress: string
    tokenId: number
  }>
) {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`query_nfts_by_collection_addresses_and_token_ids`),
      {
        params: {
          QUERY_PARAMS: JSON.stringify(params),
        },
      }
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryNFTsByAddressesAndTokenIds: ", err)
    throw Error()
  }
}

export const getNFTsOnChain = async ({
  chainId,
  ownerAddress,
  tokenAddress,
  cursor,
}: {
  chainId: number
  ownerAddress: string
  tokenAddress?: string
  cursor?: string
}) => {
  const chainTag = getChain(chainId).chainTag

  let { data: nftData } = await axios.get(
    `https://deep-index.moralis.io/api/v2/${ownerAddress}/nft`,
    {
      params: {
        chain: chainTag,
        token_addresses: tokenAddress,
        normalizeMetadata: true,
        cursor,
      },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      },
    }
  )

  return nftData.result
}

export const queryNFTUserRelation = async ({
  nftId,
  userId,
}: {
  nftId: string
  userId: string
}) => {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`query_nft_user_relation/${nftId}/${userId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryNFTUserRelation: ", err)
    throw Error()
  }
}

export const queryUserLikedNFTs = async ({ userId }: { userId: string }) => {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`query_user_liked_nfts/${userId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryUserLikedNFTs: ", err)
  }
}

export async function saveNFTsAndAssets({
  nfts,
  skipMetadataUpload,
  assetCreatorAddress,
  accessToken,
  userId,
}: {
  nfts: Array<NFT>
  accessToken: string
  userId: string
  skipMetadataUpload: boolean
  assetCreatorAddress: string
}) {
  try {
    const formattedNFTs = nfts.map((nft) => {
      let nftData = { ...nft }
      delete nftData.assets
      delete nftData.traits
      return {
        nftData,
        assets: nft.assets,
        traits: nft.traits,
        assetCreatorAddress,
        assetCreatorId: userId,
        skipMetadataUpload,
      }
    })

    const { data } = await axios.post(
      getBackendEndpoint(`create_assets_and_save_nfts`),
      {
        data: formattedNFTs,
        accessToken,
        userId,
      }
    )

    return data
  } catch (err) {
    console.log("failed saveNFTsAndAssets: ", err)
    throw Error(err)
  }
}

export async function updateNFT({
  nftId,
  name,
  description,
  marketplaceURL,
  accessToken,
  userId,
}: {
  nftId: string
  name: string
  description: string
  marketplaceURL: string
  accessToken: string
  userId: string
}) {
  try {
    const { data } = await axios.put(
      getBackendEndpoint(`update_nft/${nftId}`),
      {
        data: {
          name,
          description,
          marketplaceURL,
        },
        accessToken,
        userId,
      }
    )

    return data
  } catch (err) {
    console.log("failed updateNFT: ", err)
    throw Error(err)
  }
}

export async function likeNFT({
  nftId,
  userId,
  accessToken,
}: {
  nftId: string
  userId: string
  accessToken: string
}) {
  try {
    const { data } = await axios.post(
      getBackendEndpoint(`like_nft/${nftId}/${userId}`),
      {
        accessToken,
        userId,
      }
    )

    return data
  } catch (err) {
    console.log("failed likeNFT: ", err)
    throw Error(err)
  }
}

export async function unlikeNFT({
  nftId,
  userId,
  accessToken,
}: {
  nftId: string
  userId: string
  accessToken: string
}) {
  try {
    const { data } = await axios.post(
      getBackendEndpoint(`unlike_nft/${nftId}/${userId}`),
      {
        accessToken,
        userId,
      }
    )

    return data
  } catch (err) {
    console.log("failed unlikeNFT: ", err)
    throw Error(err)
  }
}

export async function incrementNFTViewCount({
  nftId,
  userId,
  accessToken,
}: {
  nftId: string
  userId: string
  accessToken: string
}) {
  try {
    const { data } = await axios.post(
      getBackendEndpoint(`increment_nft_view_count/${nftId}`),
      {
        accessToken,
        userId,
      }
    )

    return data
  } catch (err) {
    console.log("failed incrementNFTViewCount: ", err)
    throw Error(err)
  }
}
