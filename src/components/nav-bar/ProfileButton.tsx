import { useRef } from "react"

import styled from "@emotion/styled"
import { useWeb3React } from "@web3-react/core"
import Image from "next/image"

import { useBooleanState } from "hooks/common"

import { ProfilePhoto } from "components/ProfilePhoto"
import { ProfileDropdown } from "./ProfileDropdown"
import { useUser } from "hooks/useAuth"

export function ProfileButton() {
  const [isOpen, open, close] = useBooleanState()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { user } = useUser()

  return (
    <div>
      <Profile ref={dropdownRef}>
        <ButtonContainer onClick={open}>
          {user?.profilePhoto ? (
            <ProfilePhoto src={user.profilePhoto} />
          ) : user?.userId ? (
            <ProfilePhoto id={user.userId} />
          ) : (
            <ProfilePhoto />
          )}
          <Image
            src="/images/chevron_down.svg"
            alt="Chevron drop down"
            layout="fixed"
            width={24}
            height={24}
          />
        </ButtonContainer>
      </Profile>
      <ProfileDropdown user={user} open={isOpen} onClose={close} />
    </div>
  )
}

const Profile = styled.div`
  display: flex;
  text-align: center;
  vertical-align: middle;
  align-items: center;
  cursor: pointer;
`

const ButtonContainer = styled.div`
  display: flex;
  text-align: center;
  vertical-align: middle;
  align-items: center;
`
