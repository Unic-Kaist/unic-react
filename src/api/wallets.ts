import axios from "axios"
import { getBackendEndpoint } from "constants/apis"
import { getChain } from "constants/chains"
import { User } from "types/User"

export async function queryWalletByUserIdAndChain({
  userId,
  chainId,
}: {
  userId: string
  chainId: number
}) {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(
        `query_wallets_by_user_id_and_chain/${userId}/${
          getChain(chainId).chainTag
        }`
      )
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryWalletByUserIdAndChain: ", err)
    throw Error()
  }
}

export async function saveWallet({
  address,
  chainId,
  userId,
  accessToken,
}: {
  address: string
  chainId: number
  userId: string
  accessToken: string
}) {
  try {
    const { data } = await axios.post(getBackendEndpoint("save_wallet"), {
      data: {
        address,
        chain: getChain(chainId).chainTag,
        userId,
      },
      accessToken,
      userId,
    })
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed saveWallet: ", err)
    throw Error()
  }
}
