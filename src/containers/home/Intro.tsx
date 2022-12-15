import styled from "@emotion/styled"
import { Text } from "components/ui"
import { colors } from "constants/colors"
import Image from "next/image"
import { Media } from "utils/css"

export default function Intro() {
  return (
    <Container>
      <ItemsContainer>
        <DisplayPhoto>
          <Image src={"/images/home/intro.svg"} alt="intro" layout="fill" />
        </DisplayPhoto>
        <DisplayTextContainer>
          <MainText>NFT 2.0</MainText>
          <Text size={60} lineHeight={65} weight={700}>
            Non <br />
            Fungible <br />
            Object
          </Text>
        </DisplayTextContainer>
      </ItemsContainer>
    </Container>
  )
}

const Container = styled.div`
  background: linear-gradient(
      180deg,
      rgba(202, 220, 255, 0.5) 0%,
      rgba(213, 227, 255, 0) 100%
    ),
    linear-gradient(148.74deg, #dcfff2 22.22%, rgba(255, 255, 255, 0) 46.58%);
  ${Media.screen("md")(`
    display: flex;
    align-items: center;
    justify-content: center;
  `)}
`

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding: 30px 40px 0px 40px;
  ${Media.screen("md")(`
    flex-direction: row;
    gap: 138px
  `)}
`

const DisplayPhoto = styled.div`
  position: relative;
  width: 300px;
  height: 400px;
  ${Media.screen("sm")(`
    width: 500px;
    height: 700px;
  `)}
`

const DisplayTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 20px;
  ${Media.screen("md")(`
    align-items: flex-start;
  `)}
`

const MainText = styled.p`
  font-family: Gilroy;
  margin: 0px;
  font-size: 70px;
  font-weight: 700;
  color: black;
  ${Media.screen("sm")(`
    font-size: 120px;
  `)}
`
