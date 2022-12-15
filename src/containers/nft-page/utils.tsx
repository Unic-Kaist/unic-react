import { queryERC1155Balance, queryERC721Owner } from "api/nfts"
import { Collection } from "types/Collection"
import { NFT } from "types/NFT"

export async function queryIsCreatorOrOwner({
  nftData,
  collectionData,
  account,
  chainId,
}: {
  nftData: NFT
  collectionData: Collection
  account: string
  chainId: number
}): Promise<boolean> {
  const isCreator = nftData?.creatorAddress == account

  const isOwner =
    (nftData?.supply == 1 &&
      collectionData?.standard == "ERC1155" &&
      (await queryERC1155Balance({
        collectionAddress: collectionData?.address,
        tokenId: nftData?.tokenId,
        ownerAddress: account,
        chainId,
      })) >= 1) ||
    (collectionData?.standard == "ERC721" &&
      (
        await queryERC721Owner({
          collectionAddress: collectionData?.address,
          tokenId: nftData?.tokenId,
          chainId,
        })
      ).toLowerCase() == account.toLowerCase())

  return isOwner || isCreator
}
