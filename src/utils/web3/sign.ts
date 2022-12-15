export async function signNFT({
  library,
  maxTokenId,
  minPrice,
  amount,
  chainId,
  contractAddress,
}: {
  library: any
  maxTokenId: number
  minPrice: number
  amount: number
  chainId: number
  contractAddress: string
}) {
  const signer = library.getSigner()

  const domain = {
    name: "Unic",
    version: "1",
    chainId,
    verifyingContract: contractAddress,
  }

  const types = {
    NFTVoucher: [
      { name: "maxTokenId", type: "uint256" },
      { name: "minPrice", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
  }

  const voucher = {
    maxTokenId,
    minPrice,
    amount,
  }

  try {
    const signature = await signer._signTypedData(domain, types, voucher)
    return signature
  } catch (err) {
    console.log("sign failed:", err)
  }
}
