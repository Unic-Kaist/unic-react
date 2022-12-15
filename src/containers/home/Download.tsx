import styled from "@emotion/styled"
import { Text as TextComponent } from "components/ui"
import { colors } from "constants/colors"
import Image from "next/image"
import { Media } from "utils/css"
import { useComingSoonDialog } from "./ComingSoonModal"

export default function How() {
  const openModal = useComingSoonDialog()
  return (
    <Container>
      <CardContainer>
        <TextContainer>
          <Text weight={500} color={colors.black}>
            <b>Download Unic app</b> to track your NFT 2.0 and verify real life
            assets.
          </Text>
          <Text weight={700} color={colors.black}>
            Coming Soon!
          </Text>
          <DownloadButtonsContainer>
            <AppstoreImage>
              <span onClick={openModal}>
                <Image
                  src="/images/home/appstore.svg"
                  alt="appstore"
                  layout="fill"
                  objectFit="contain"
                />
              </span>
            </AppstoreImage>
            <GooglePlayImage>
              <span onClick={openModal}>
                <Image
                  src="/images/home/google_play.svg"
                  alt="google_play"
                  layout="fill"
                  objectFit="contain"
                />
              </span>
            </GooglePlayImage>
          </DownloadButtonsContainer>
        </TextContainer>
        <DisplayImageContainer>
          <Image src="/images/home/download.svg" alt="download" layout="fill" />
        </DisplayImageContainer>
      </CardContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 70px;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  align-items: center;
  justify-content: center;
  box-shadow: -4px 4px 30px rgba(67, 68, 68, 0.1);
  border-radius: 30px;
  ${Media.screen("md")(`
    flex-direction: row;
    width: 1260px;
  `)}
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 30px;
  margin: 60px 30px;
  ${Media.screen("md")(`
    align-items: flex-start;
`)}
`

const DownloadButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

const AppstoreImage = styled.div`
  position: relative;
  height: 50px;
  width: 155px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const GooglePlayImage = styled.div`
  position: relative;
  height: 50px;
  width: 180px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const DisplayImageContainer = styled.div`
  display: none;
  ${Media.screen("md")(`
    display: flex;
    flex-direction: row;
    position: relative;
    height: 400px;
    width: 600px;
  `)}
`

const Text = styled(TextComponent)`
  font-size: 25px;
  text-align: center;
  ${Media.screen("md")(`
    font-size: 30px;
    width: 500px;
    text-align: left;
  `)}
`
