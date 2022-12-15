import axios from "axios"
import { getBackendEndpoint } from "constants/apis"
import { User } from "types/User"

export async function queryUserByAddress({
  address,
  chainTag,
}: {
  address: string
  chainTag: string
}) {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`query_user_by_wallet_address/${address}/${chainTag}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryUserByAddress: ", err)
    throw Error()
  }
}

export async function queryUserById(userId: string) {
  try {
    const { data } = await axios.get(getBackendEndpoint(`query_user/${userId}`))
    if (data.success) {
      data.data.socialLinks = JSON.parse(data.data.socialLinks)
      return data.data
    } else {
      throw Error("server message error")
    }
  } catch (err) {
    console.log("failed queryUserById: ", err)
    throw Error()
  }
}

export async function queryUserByTag(tag: string) {
  try {
    const { data } = await axios.get(
      getBackendEndpoint(`query_user_by_tag/${tag}`)
    )
    if (data.success) {
      data.data.socialLinks = JSON.parse(data.data.socialLinks)
      return data.data
    } else {
      throw Error("server message error")
    }
  } catch (err) {
    console.log("failed queryUserById: ", err)
    throw Error()
  }
}

export async function saveUser({ user }: { user: User }) {
  try {
    const { data } = await axios.post(getBackendEndpoint("save_user"), {
      data: user,
      userId: user.userId,
      accessToken: user.accessToken,
    })
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed saveUser: ", err)
    throw Error()
  }
}
