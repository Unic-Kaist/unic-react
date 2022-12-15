import styled from "@emotion/styled"
import { Spacing, Text } from "components/ui"
import SocialIcons from "components/ui/SocialIcons"
import { colors } from "constants/colors"
import Image from "next/image"
import { Media } from "utils/css"

export default function Footer() {
  return (
    <Container>
      <MissionContainer>
        <Image
          src={"/images/home/full_logo_white.svg"}
          alt="intro"
          width={200}
          height={80}
        />
        <Text size={20} weight={700} color={colors.white}>
          Make Anything Unique
        </Text>
        <Text size={15} weight={300} color={colors.white}>
          The implementation of NFT was limited to only digital items. Why not
          go beyond? We want to build a world where anything we can touch and
          see can be non-fungible.
        </Text>
      </MissionContainer>

      <CommunityContainer>
        <Text size={30} weight={700} color={colors.white}>
          Join the community.
        </Text>
        <Spacing height={10} />
        <SocialIcons
          color={colors.white}
          website="https://unic.io"
          discord="https://discord.gg/wDX4HADQ5b"
          twitter="https://twitter.com/0xUnic"
          telegram="https://t.me/unic_labs"
          // medium="link"
        />
      </CommunityContainer>
    </Container>
  )
}

const Container = styled.div`
  background: ${colors.charcoal};
  padding: 30px 40px;
  gap: 80px;
  ${Media.screen("sm")(`
    display: flex;
    padding: 30px 70px;
  `)};
  ${Media.screen("md")(`
    display: flex;
    padding: 70px 140px;
  `)};
`

const MissionContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 10px;
  flex-direction: column;
  align-items: flex-start;
  width: 250px;
  margin-bottom: 30px;
  ${Media.screen("sm")(`
  width: 400px;
  `)};
`

const CommunityContainer = styled.div`
  flex: 1;
  max-width: 1265px;
`
