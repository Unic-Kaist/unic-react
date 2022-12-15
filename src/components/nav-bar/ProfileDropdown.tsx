import React from "react"

import styled from "@emotion/styled"
import { useWeb3React } from "@web3-react/core"
import Link from "next/link"

import { Dropdown, Spacing } from "components/ui"

import Button from "components/ui/Buttons"
import { useAuthDialog } from "components/auth"
import ConnectButton from "components/wallet/ConnectButton"
import { cognitoSignOut } from "src/services/cognito"

import { User } from "types/User"
import { useUser } from "hooks/useAuth"

export function ProfileDropdown({
  user,
  open,
  onClose,
}: {
  user: User
  open: boolean
  onClose: () => void
}) {
  const { account } = useWeb3React()
  const openAuth = useAuthDialog()
  const { setUser } = useUser()
  return (
    <Dropdown open={open} onClose={onClose}>
      <Container>
        {!user?.userId ? (
          <React.Fragment>
            <Username>Sign In / Sign Up</Username>
            <Spacing height={14} />
            <Button
              style={{
                height: 40,
              }}
              onClick={() => {
                onClose()
                openAuth()
              }}
            >
              Sign In
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Username>Connect Wallet</Username>
            <Spacing height={14} />
            <ConnectButton
              style={{
                height: 40,
              }}
              callback={onClose}
            />
          </React.Fragment>
        )}
        {user?.userId && (
          <React.Fragment>
            <Divider />
            <DropdownItem>
              <Link href={`/profile`}>
                <LinkText>My Profile</LinkText>
              </Link>
            </DropdownItem>
          </React.Fragment>
        )}
        <Divider />
        {/**TODO: Change links to respective pages*/}
        <DropdownItem>
          <Link href="/">
            <LinkText>About Us</LinkText>
          </Link>
        </DropdownItem>
        {user?.userId && (
          <React.Fragment>
            <Divider />
            <DropdownItem
              onClick={async () => {
                // disconnect()
                await cognitoSignOut()
                setUser({})
                onClose()
              }}
            >
              <LinkText>Log out</LinkText>
            </DropdownItem>
          </React.Fragment>
        )}
      </Container>
    </Dropdown>
  )
}

const Username = styled.div`
  display: flex;
  font-family: Gilroy;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  align-items: center;
`

const Container = styled.div`
  width: 248px;
  padding: 24px 14px;
`

const DropdownItem = styled.div`
  font-family: Gilroy;
  display: flex;
  align-items: center;
  padding: 6px 0;
  /* Hover: color change */
  cursor: pointer;
  &:hover {
    color: #7b61ff;
  }
  -webkit-transition: all 500ms ease;
  -moz-transition: all 500ms ease;
  -ms-transition: all 500ms ease;
  -o-transition: all 500ms ease;
  transition: all 500ms ease;
  /* Screen halved */
`

const LinkText = styled.a`
  font-family: Gilroy;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 130%;
`

const Divider = styled.hr`
  margin: 14px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  width: 100%;
`
