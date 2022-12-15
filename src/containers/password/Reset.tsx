import { KeyboardEventHandler, useState } from "react"

import styled from "@emotion/styled"
import { useRouter } from "next/router"

import { Spacing } from "components/layout"
import { Input, Text } from "components/ui"
import Button from "components/ui/Buttons"
import { colors } from "constants/colors"
import { MainNavbar } from "components/MainNavbar"
import { useInputState } from "hooks/common"
import { validatePassword } from "components/auth/validate"
import { useMutation } from "react-query"
import { cognitoPasswordReset } from "src/services/cognito"
import { Toast } from "components/ui/Toast"
import EyeIcon, { EyeClosedIcon } from "components/icons/EyeIcon"
import { QS } from "utils/url"

export default function PasswordReset() {
  const [password, onPasswordChange] = useInputState("")
  const [showPassword, setShowPassword] = useState(false)
  const { push } = useRouter()
  const userId = QS.get("user")
  const code = QS.get("code")
  const isValidAccess = userId && code

  const { mutate, isLoading } = useMutation(
    ["password_reset"],
    async () => {
      const cognitoResponse = await cognitoPasswordReset(userId, code, password)

      if (cognitoResponse?.code) {
        throw Error(cognitoResponse)
      }
    },
    {
      onSuccess: () => {
        Toast.success("Password successfully reset!")
        push("/explore")
      },
      onError: (error: any) => {
        const message = error.message.split(":").at(-1)
        console.log("failed passwordReset: ", message)
        Toast.error(message)
      },
    }
  )

  const onReset = async () => {
    if (validatePassword(password)) {
      mutate()
    }
  }

  const handleKeyPress: KeyboardEventHandler = (e: any) => {
    if (e.key === "Enter") {
      onReset()
    }
  }

  return (
    <Container>
      <MainNavbar />
      <Center>
        <Text
          font="Gilroy"
          weight="700"
          size={32}
          lineHeight={38}
          color={colors.black}
        >
          {isValidAccess ? "Please enter your new password" : "Invalid Access"}
        </Text>
        <Spacing height={20} />
        <Text font="Gilroy" weight="600" size={22} color={colors.gray1}>
          {isValidAccess
            ? "You will be able to login with the new password after reset."
            : "This page is for password reset."}
        </Text>
        <Spacing height={40} />
        <InputContainer>
          {isValidAccess ? (
            <Input
              size={20}
              label="Password"
              placeholder="Password"
              onChange={onPasswordChange}
              onKeyUp={handleKeyPress}
              value={password}
              type={showPassword ? "text" : "password"}
              right={
                showPassword ? (
                  <StyledEyeIcon
                    width={20}
                    height={20}
                    color={colors.gray1}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <StyledEyeClosedIcon
                    width={20}
                    height={20}
                    color={colors.gray1}
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
            />
          ) : null}
        </InputContainer>
        <Spacing height={30} />
        <StyledButton
          loading={isLoading}
          onClick={() => {
            isValidAccess ? onReset() : push("/explore")
          }}
        >
          {isValidAccess ? "Reset Password" : "Go Back"}
        </StyledButton>
      </Center>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  max-width: 1248px;
  margin: 0 auto;
`

const Center = styled.div`
  height: calc(100vh - 156px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`

const InputContainer = styled.div`
  max-width: 600px;
  width: 100%;
`

const StyledButton = styled(Button)`
  max-width: 600px;
  width: 100%;
`

const StyledEyeIcon = styled(EyeIcon)`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const StyledEyeClosedIcon = styled(EyeClosedIcon)`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`
