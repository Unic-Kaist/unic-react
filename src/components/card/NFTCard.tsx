import React, { ReactNode } from "react"

import styled from "@emotion/styled"
import Link from "next/link"

import { NFT } from "types/index"

import { CommonCard } from "./CommonCard"

import { Spacing } from "components/layout"
import { SIUints } from "utils/format"
import { colors } from "constants/colors"
import ScanIcon from "components/icons/ScanIcon"

interface Props {
  data: NFT
  flag?: string
  attributes?: Object
  children?: ReactNode
  hideHover?: boolean
}

export function NFTCard({
  data,
  attributes,
  flag,
  hideHover,
  children,
}: Props) {
  const { name, scans, imageURL } = data
  return (
    <CommonCard
      hideHover={hideHover}
      name={name ?? "--"}
      header={
        <Container>
          <CommonCard.Image
            name={name ?? "--"}
            url={imageURL ? imageURL : null}
            width={222}
            height={190}
          >
            {flag ? (
              <Flag>{flag}</Flag>
            ) : scans ? (
              <Flag>
                <ScanIcon width={10} height={10} color={colors.white} />
                <Spacing width={7} />
                {SIUints.format(200)}
              </Flag>
            ) : null}
          </CommonCard.Image>
          <Spacing width={4} />
        </Container>
      }
      attributes={attributes}
    >
      {children}
    </CommonCard>
  )
}

const Container = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
`

const Flag = styled.div`
  font-family: Gilroy;
  display: flex;
  align-items: center;
  color: ${colors.white};
  position: absolute;
  right: 0;
  bottom: 0;
  background: ${colors.black};
  padding: 7px 6px;
  border-radius: 10px 0px 0px 0px;
`
