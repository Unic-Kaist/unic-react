import styled from "@emotion/styled"
import { likeNFT, queryNFTUserRelation, unlikeNFT } from "api/nfts"
import HeartIcon from "components/icons/HeartIcon"
import { Toast } from "components/ui/Toast"
import { colors } from "constants/colors"
import { useUser } from "hooks/useAuth"
import Image from "next/image"
import { useMutation, useQuery, UseQueryResult } from "react-query"
import { NFT, NFTUserRelation } from "types/NFT"
import { Media } from "utils/css"

export default function NFTPhoto({ nft }: { nft: NFT }) {
  const { user } = useUser()

  const {
    data: nftUserRelation,
    isLoading: nftUserRelationLoading,
    refetch,
  }: {
    data: NFTUserRelation
    isLoading: boolean
    refetch: any
  } = useQuery(
    nft?.nftId &&
      user?.userId && ["query_nft_user_relation", nft?.nftId, user?.userId],
    async () => {
      return await queryNFTUserRelation({
        nftId: nft?.nftId,
        userId: user?.userId,
      })
    }
  )

  const { mutate: likeNFTMutate, isLoading: likeNFTLoading } = useMutation(
    nft?.nftId && user?.userId && ["like_nft", nft?.nftId, user?.userId],
    async () => {
      await likeNFT({
        nftId: nft?.nftId,
        userId: user?.userId,
        accessToken: user?.accessToken,
      })
    },
    {
      onSuccess: () => {
        refetch()
        Toast.success("NFT marked!")
      },
      onError: (error: any) => {
        Toast.error(
          error.message
            ? error.message
            : "Could not mark nft. Please try again later."
        )
        console.log("like_nft error: ", error)
      },
    }
  )

  const { mutate: unlikeNFTMutate, isLoading: unlikeNFTLoading } = useMutation(
    nft?.nftId && user?.userId && ["like_nft", nft?.nftId, user?.userId],
    async () => {
      await unlikeNFT({
        nftId: nft?.nftId,
        userId: user?.userId,
        accessToken: user?.accessToken,
      })
    },
    {
      onSuccess: () => {
        refetch()
        Toast.success("NFT unmarked!")
      },
      onError: (error: any) => {
        Toast.error(
          error.message
            ? error.message
            : "Could not mark nft. Please try again later."
        )
        console.log("like_nft error: ", error)
      },
    }
  )

  return (
    <PhotoContainer>
      <Image
        src={nft?.imageURL ? nft.imageURL : ""}
        layout="fill"
        objectFit="cover"
      ></Image>
      <Footer>
        {/* <EthereumIcon style={{ marginLeft: 20 }} height={30} width={30} /> */}
        <div></div>
        <HeartIconContainer
          isLoading={
            nftUserRelationLoading || likeNFTLoading || unlikeNFTLoading ? 1 : 0
          }
          onClick={() =>
            nftUserRelation?.isLiked ? unlikeNFTMutate() : likeNFTMutate()
          }
        >
          <HeartIcon
            color={nftUserRelation?.isLiked ? colors.red : "black"}
            filled={nftUserRelation?.isLiked}
            style={{ marginRight: 20 }}
            height={30}
            width={30}
          />
        </HeartIconContainer>
      </Footer>
    </PhotoContainer>
  )
}

const PhotoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  border: 1px solid ${colors.gray3};
  border-radius: 20px;
  background-color: ${colors.gray5};
  ${Media.screen("sm")(`
    width: 500px;
    height: 500px;
  `)}
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  height: 50px;
  width: 100%;
  bottom: 0px;
  left: 0px;
  background-color: white;
`

const HeartIconContainer = styled.div<{ isLoading: number }>`
  cursor: pointer;
  opacity: ${(p) => (p.isLoading ? "0.5" : "1")};
  &:hover {
    opacity: 0.5;
  }
`
