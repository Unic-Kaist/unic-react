import axios from "axios"
import { getBackendEndpoint } from "constants/apis"
import { getChain } from "constants/chains"
import { ethers } from "ethers"
import { Collection, CollectionType } from "types/Collection"
import { getProvider } from "utils/web3/provider"
import { v4 as uuidv4 } from "uuid"

export async function queryCollectionOwner(collectionAddress: string) {
  const ownerAbi = [
    {
      inputs: [],
      name: "owner",
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
  ]

  const provider = getProvider()

  const collectionContract = new ethers.Contract(
    collectionAddress,
    ownerAbi,
    provider
  )

  try {
    return await collectionContract.owner()
  } catch {
    return ""
  }
}

export async function queryCollection(collectionId: string) {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`query_collection/${collectionId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryCollection: ", err)
    throw Error()
  }
}

interface CollectionsQueryParams {
  isCreatedByUinc?: boolean
  category?: CollectionType
  creatorAddress?: string
  filterTest?: boolean
}

export async function queryCollections(params: CollectionsQueryParams) {
  try {
    params.category = params.category || CollectionType.ALL
    params.filterTest = true
    const { data } = await axios.get(getBackendEndpoint(`query_collections`), {
      params: {
        QUERY_PARAMS: JSON.stringify(params),
      },
    })
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryCollections: ", err)
    throw Error()
  }
}

export async function queryCollectionScanAndViewCount(collectionId: string) {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`query_collection_scan_and_view_count/${collectionId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryCollectionScanAndViewCount: ", err)
    throw Error()
  }
}

export const getCollectionsOnChain = async (
  address: string,
  chainId: number
) => {
  const chainTag = getChain(chainId).chainTag
  const { data } = await axios.get(
    `https://deep-index.moralis.io/api/v2/${address}/nft/collections`,
    {
      params: { chain: chainTag },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      },
    }
  )

  const collectionsInfo = await Promise.all(
    data.result.map(async (d: any) => {
      let { data: nftData } = await axios.get(
        `https://deep-index.moralis.io/api/v2/${address}/nft`,
        {
          params: {
            chain: chainTag,
            limit: 1,
            token_addresses: d.token_address,
            normalizeMetadata: true,
          },
          headers: {
            accept: "application/json",
            "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
          },
        }
      )
      const singleNFT = nftData.result[0]
      return {
        mainPhoto: singleNFT.normalized_metadata.image,
        name: singleNFT.name,
        symbol: singleNFT.symbol,
        collectionId: singleNFT.token_address,
        address: singleNFT.token_address,
        standard: singleNFT.contract_type,
      }
    })
  )

  return collectionsInfo
}

export async function saveCollection({
  collection,
  accessToken,
  userId,
}: {
  collection: Collection
  accessToken: string
  userId: string
}) {
  try {
    const { data } = await axios.post(getBackendEndpoint("save_collection"), {
      data: collection,
      accessToken,
      userId,
    })

    if (data.success) {
      return data.message
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed saveCollection: ", err)
    throw Error()
  }
}

export const queryCollectionUserRelation = async ({
  collectionId,
  userId,
}: {
  collectionId: string
  userId: string
}) => {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(
        `query_collection_user_relation/${collectionId}/${userId}`
      )
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryCollectionUserRelation: ", err)
    throw Error()
  }
}

export const queryUserLikedCollections = async ({
  userId,
}: {
  userId: string
}) => {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`query_user_liked_collections/${userId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryUserLikedCollections: ", err)
  }
}

export async function likeCollection({
  collectionId,
  userId,
  accessToken,
}: {
  collectionId: string
  userId: string
  accessToken: string
}) {
  try {
    const { data } = await axios.post(
      getBackendEndpoint(`like_collection/${collectionId}/${userId}`),
      {
        accessToken,
        userId,
      }
    )

    return data
  } catch (err) {
    console.log("failed likeCollection: ", err)
    throw Error(err)
  }
}

export async function unlikeCollection({
  collectionId,
  userId,
  accessToken,
}: {
  collectionId: string
  userId: string
  accessToken: string
}) {
  try {
    const { data } = await axios.post(
      getBackendEndpoint(`unlike_collection/${collectionId}/${userId}`),
      {
        accessToken,
        userId,
      }
    )

    return data
  } catch (err) {
    console.log("failed unlikeCollection: ", err)
    throw Error(err)
  }
}
