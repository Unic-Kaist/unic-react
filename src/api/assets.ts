import axios from "axios"
import { getBackendEndpoint } from "constants/apis"
import { Asset } from "types/Asset"

export async function queryAssetsByNFTId(nftId: string) {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`query_assets_by_nft_id/${nftId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error("server message error")
    }
  } catch (err) {
    console.log("failed queryCollection: ", err)
    throw Error()
  }
}

export async function updateAsset({
  assetId,
  visibility,
  accessToken,
  userId,
}: {
  assetId: string
  visibility: boolean
  accessToken: string
  userId: string
}) {
  try {
    console.log({
      data: {
        visibility,
      },
    })
    const { data } = await axios.put(
      getBackendEndpoint(`update_asset/${assetId}`),
      {
        data: {
          visibility,
        },
        accessToken,
        userId,
      }
    )

    if (!data.success) {
      throw Error(data.message)
    }

    return data
  } catch (err) {
    console.log("failed updateAsset: ", err)
    throw Error(err)
  }
}

export async function createAssets({
  nftId,
  assetCreatorAddress,
  assets,
  accessToken,
  userId,
}: {
  nftId: string
  assetCreatorAddress: string
  assets: Array<Asset>
  accessToken: string
  userId: string
}) {
  try {
    const { data } = await axios.post(getBackendEndpoint(`save_assets`), {
      data: {
        nftId,
        assetCreatorAddress,
        assetCreatorId: userId,
        assets,
      },
      accessToken,
      userId,
    })

    if (!data.success) {
      throw Error(data.message)
    }

    return data
  } catch (err) {
    console.log("failed updateAsset: ", err)
    throw Error(err)
  }
}
