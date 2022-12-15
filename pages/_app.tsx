console.warn = () => {}
import "../styles/global.scss"

import type { AppProps } from "next/app"
import axios from "axios"
import { RecoilRoot } from "recoil"
import { Amplify } from "aws-amplify"
import { QueryClient, QueryClientProvider } from "react-query"
import { ModalProvider } from "hooks/useModal"
import getLibrary from "utils/getLibrary"
import { PopupProvider } from "providers/PopupProvider"
import { PortalProvider } from "providers/PortalProvider"
import { TooltipProvider } from "providers/TooltipProvider"
import { Web3Manager } from "providers/Web3Manager"
import { Toaster } from "react-hot-toast"
import Head from "next/head"
import { Web3ReactProvider } from "@web3-react/core"
import { cognitoRefreshSessionHook } from "../src/services/cognito"
import { ReactNode, useEffect } from "react"
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchInterval: false,
      refetchOnWindowFocus: true,
    },
  },
})

const awsconfig = JSON.parse(process.env.NEXT_PUBLIC_AWS_CONFIGURE || "")
Amplify.configure({
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    // urlOpener,
  },
})

function Unic({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={client}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3Manager>
            <PortalProvider>
              <Head>
                <title>Unic</title>
                <meta
                  name="viewport"
                  content="initial-scale=1.0, width=device-width"
                />
              </Head>
              <ModalProvider>
                <PopupProvider>
                  <TooltipProvider>
                    <Main Component={Component} pageProps={pageProps} />
                    {/* <Component {...pageProps} /> */}
                  </TooltipProvider>
                </PopupProvider>
              </ModalProvider>
            </PortalProvider>
            <Toaster />
          </Web3Manager>
        </Web3ReactProvider>
      </QueryClientProvider>
    </RecoilRoot>
  )
}

function Main({ Component, pageProps }: AppProps) {
  cognitoRefreshSessionHook()
  return <Component {...pageProps} />
}

export default Unic
