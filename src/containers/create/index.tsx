import React from "react"

import styled from "@emotion/styled"

import SelectOptionPage from "./choose-option"
import { MainNavbar } from "components/MainNavbar"

export default function CreatePage() {
  return (
    <Container>
      <MainNavbar />
      <SelectOptionPage />
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`
