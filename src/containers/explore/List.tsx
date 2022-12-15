import { CollectionCard } from "components/card"
import { useSearchKeywords } from "components/filter-bar/useSearchKeywords"
import {
  CardListAlignTypes,
  CardListContainer,
} from "components/CardListContainer"
import styled from "@emotion/styled"
import { collectionsMock } from "src/mock-data/collections"
import { useQuery } from "react-query"
import { queryCollections } from "src/api/collections"
import { Collection, CollectionType } from "types/Collection"

export default function CollectionList({ tab }: { tab: string }) {
  const keywords = useSearchKeywords()

  const { isLoading, data } = useQuery(
    tab && [`get_all_${tab}_collections`, tab],
    async () => {
      const data = await queryCollections({
        category: tab as CollectionType,
      })
      return data
    }
  )

  return (
    <CardListContainer
      align={CardListAlignTypes.left}
      loading={isLoading}
      collection
    >
      {data
        ?.filter(
          (i) =>
            !keywords.value.length ||
            keywords.value.some(
              (keyword) =>
                i.name?.includes(keyword) ||
                i.creatorAddress?.includes(keyword) ||
                i.description?.includes(keyword) ||
                i.collectionAddress?.includes(keyword)
            )
        )
        .map((collection: Collection, i) => (
          <Center key={i}>
            <CollectionCard data={collection} />
          </Center>
        ))}
    </CardListContainer>
  )
}

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
