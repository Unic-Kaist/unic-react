import styled from "@emotion/styled"
import { Spacing, Text } from "components/ui"
import { colors } from "constants/colors"
import Image from "next/image"
import { useState } from "react"
import { Media } from "utils/css"

export default function How() {
  return (
    <Container>
      <Text size={20} weight={700} color={colors.primary.color}>
        How it works
      </Text>
      <Spacing height={10} />
      <Text
        size={40}
        weight={700}
        color={colors.black}
        style={{ textAlign: "center" }}
      >
        Bring real world utility to NFTs
        <br /> in a few clicks
      </Text>
      <StepsContainer>
        <Step
          step={1}
          image="/images/home/create_1.svg"
          title="Choose a NFT"
          description="Choose a NFT you want to peg from your collection of NFTs. Don’t have an NFT? You can also create one on our dashboard."
        />
        <Step
          step={2}
          image="/images/home/create_2.svg"
          title="Peg your NFT to an asset"
          description="Your asset, such as the NFT image, will be converted into a unique, verifiable asset that cannot be manipulated."
        />
        <Step
          step={3}
          image="/images/home/create_3.svg"
          title="Print your asset"
          description="Print, publish, and upload your asset everywhere. Your NFT will be verifiable with UNIC app anywhere it goes."
        />
      </StepsContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 70px;
`

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  overflow-x: auto;
  ${Media.screen("md")(`
    flex-direction: row;
  `)}
`

interface StepProps {
  step: number
  image: string
  title: string
  description: string
  link?: string
  linkText?: string
}

function Step({ step, image, title, description, link, linkText }: StepProps) {
  return (
    <StepContainer>
      <StepNumberTag>
        <Text
          size={15}
          weight={700}
          color={colors.primary.color}
          style={{
            textAlign: "center",
            backgroundColor: `${colors.primary.light}`,
            padding: "7px 12px",
            borderRadius: 20,
          }}
        >
          {step}
        </Text>
      </StepNumberTag>
      <StepImageContainer>
        <Image src={image} alt="intro" layout="fill" objectFit="contain" />
      </StepImageContainer>
      <Text size={20} weight={700} color={colors.black}>
        {title}
      </Text>
      <Spacing height={10} />
      <Text size={16} weight={500} color={colors.gray3}>
        {description}
      </Text>
    </StepContainer>
  )
}

const StepContainer = styled.div`
  flex: 1;
  width: 377px;
  padding: 30px;
`

const StepNumberTag = styled.div`
    background-color: ${colors.primary.color}
    width: 30px;
    height: 30px;
    border-radius: 30px;
`

const StepImageContainer = styled.div`
  position: relative;
  width: 377px;
  height: 251px;
  box-shadow: -4px 4px 30px rgba(67, 68, 68, 0.1);
  margin: 20px 0px 20px 0px;
  ${Media.screen("sm")(`
    width: 377px;
    height: 251px;
  `)}
`
