import { MainNavbar } from "components/MainNavbar"
import styled from "@emotion/styled"
import Intro from "./Intro"
import How from "./How"
import Download from "./Download"
import Footer from "./Footer"

export default function Explore() {
  return (
    <Container>
      <MainNavbar />
      <Intro />
      <How />
      <Download />
      <Footer />
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  overflow-x: hidden;
`

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`
