import { Auth } from "aws-amplify"
import { useUser } from "hooks/useAuth"
import { useEffect } from "react"
import { User } from "types/User"

// Sign up a user with name, email and passwod
export const cognitoSignUp = async (email: string, password: string) => {
  let user: User | object
  try {
    return await Auth.signUp({
      username: email,
      password: password,
      attributes: {
        email: email, // optional
      },
    })
  } catch (error) {
    console.log("Failed cognitoSignUp: ", error)
    return error
  }
}

export const cognitoSignIn = async (email: string, password: string) => {
  let user: User | object
  try {
    return await Auth.signIn(email, password)
  } catch (error) {
    return error
  }
}

export const resendSignUp = async (email: string) => {
  try {
    return await Auth.resendSignUp(email)
  } catch (error) {
    console.log("Failed resendSignUp: ", error)
    return error
  }
}

export const cognitoSignOut = async () => {
  try {
    await Auth.signOut()
  } catch (error) {
    console.log("Failed cognitoSignOut: ", error)
    return error
  }
}

export const cognitoGetCurrentUser = async () => {
  try {
    return await Auth.currentAuthenticatedUser()
  } catch (error) {
    console.log("Failed cognitoGetCurrentUser: ", error)
    return error
  }
}

export const cognitoSendPasswordReset = async (email: string) => {
  try {
    return await Auth.forgotPassword(email)
  } catch (error) {
    console.log("Failed cognitoSendPasswordReset: ", error)
    return error
  }
}

export const cognitoPasswordReset = async (
  email: string,
  codeInputText: string,
  password: string
) => {
  try {
    return await Auth.forgotPasswordSubmit(email, codeInputText, password)
  } catch (error) {
    console.log("Failed cognitoPasswordReset: ", error)
    return error
  }
}

export function cognitoRefreshSessionHook() {
  const { user, setUser } = useUser()

  const refresh = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser()
      const currentSession = currentUser.signInUserSession
      currentUser.refreshSession(
        currentSession.refreshToken,
        (err, session: any) => {
          if (err) throw Error(err.message)
          setUser({
            ...user,
            accessToken: session.accessToken.jwtToken,
          })
        }
      )
    } catch (error) {
      console.log("Failed cognitoRefreshSession: ", error)
      return error
    }
  }

  useEffect(() => {
    refresh()
  }, [])
}
