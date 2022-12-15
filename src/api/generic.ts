import axios from "axios"
import { getBackendEndpoint } from "constants/apis"
import { Asset } from "types/Asset"

export async function queryExternalImgMetadata(endpoint: string) {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`fetch_external_img_metadata/?ENDPOINT=${endpoint}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryExternalImgMetadata: ", err)
    // throw Error()
  }
}

export async function createPresignedURL({
  userId,
  accessToken,
  assets,
}: {
  userId: string
  accessToken: string
  assets: Array<Asset>
}) {
  try {
    const { data } = await axios.post(
      getBackendEndpoint("create_pre_signed_url"),
      {
        data: {
          userId,
          assets,
        },
        accessToken,
        userId,
      }
    )

    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed createPresignedURL: ", err)
    throw Error()
  }
}
