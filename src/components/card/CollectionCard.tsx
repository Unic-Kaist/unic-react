import React from "react"

import styled from "@emotion/styled"
import Link from "next/link"

import { Collection } from "types/index"

import { CommonCard } from "./CommonCard"

import { Spacing } from "components/layout"
import { commaizeNumber } from "utils/format"
import { colors } from "constants/colors"
import { withProps } from "hocs/withProps"

interface Props {
  data: Collection
  attributes?: Object
}

export function CollectionCard({ data, attributes }: Props) {
  const { collectionId, name, creatorAddress, scans } = data
  const displayName = name?.length > 20 ? name?.slice(0, 20) + "..." : name
  return (
    <Link href={`/collection/${collectionId}`} passHref>
      <CommonCard
        name={displayName}
        header={
          <Container>
            <CommonCard.Image
              name={displayName}
              url={data.coverPhoto}
              width={390}
              height={190}
            >
              {/* <CountLabel>+{scans ? scans : 0}</CountLabel> */}
              <SmallImage url={data.mainPhoto} />
            </CommonCard.Image>
            <Spacing width={4} />
          </Container>
        }
        attributes={
          attributes || {
            Creator: creatorAddress
              ? creatorAddress.slice(0, 5) + "..." || "-"
              : "--",
            Scans: commaizeNumber(scans ? scans : 0),
          }
        }
      />
    </Link>
  )
}

const Container = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 3px;
`

const SmallImage = styled(
  withProps(CommonCard.Image, {
    width: 70,
    height: 70,
  })
)<{
  url: string
}>`
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 5px;
  border: 3px solid white;
  url: ${(p) => p.url};
`

const CountLabel = styled.div`
  font-family: Gilroy;
  color: ${colors.white};
  position: absolute;
  right: 0;
  bottom: 0;
  background: ${colors.black};
  padding: 7px 6px;
  border-radius: 10px 0px 0px 0px;
`
