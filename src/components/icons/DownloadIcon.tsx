import { colors } from "constants/colors"
import React from "react"

export default function DownloadIcon({ ...props }) {
  const { color } = props
  return (
    <svg {...props} viewBox="0 0 49 50" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M38.7924 37.25H10.2091C9.0815 37.25 8.16742 38.1641 8.16742 39.2917C8.16742 40.4192 9.0815 41.3333 10.2091 41.3333H38.7924C39.92 41.3333 40.8341 40.4192 40.8341 39.2917C40.8341 38.1641 39.92 37.25 38.7924 37.25Z"
        fill={color ? color : colors.black}
      />
      <path
        d="M8.16742 35.2083V39.2916C8.16742 40.4192 9.0815 41.3333 10.2091 41.3333C11.3367 41.3333 12.2508 40.4192 12.2508 39.2916V35.2083C12.2508 34.0807 11.3367 33.1666 10.2091 33.1666C9.0815 33.1666 8.16742 34.0807 8.16742 35.2083Z"
        fill={color ? color : colors.black}
      />
      <path
        d="M36.75 35.2083V39.2916C36.75 40.4192 37.6641 41.3333 38.7916 41.3333C39.9192 41.3333 40.8333 40.4192 40.8333 39.2916V35.2083C40.8333 34.0807 39.9192 33.1666 38.7916 33.1666C37.6641 33.1666 36.75 34.0807 36.75 35.2083Z"
        fill={color ? color : colors.black}
      />
      <path
        d="M24.5005 31.1251C24.0772 31.1283 23.6634 30.9999 23.3163 30.7576L15.1496 25.0001C14.7095 24.6878 14.4108 24.214 14.319 23.6822C14.2272 23.1505 14.3497 22.6039 14.6596 22.1622C14.8144 21.9414 15.0113 21.7534 15.2391 21.6091C15.4668 21.4648 15.7209 21.3671 15.9867 21.3215C16.2524 21.2759 16.5246 21.2835 16.7874 21.3437C17.0502 21.4039 17.2985 21.5155 17.518 21.6722L24.5005 26.5518L31.4421 21.3251C31.8753 21.0002 32.4198 20.8607 32.9559 20.9373C33.4919 21.0139 33.9756 21.3002 34.3005 21.7334C34.6254 22.1666 34.7649 22.7111 34.6883 23.2472C34.6117 23.7832 34.3253 24.2669 33.8921 24.5918L25.7255 30.7168C25.3721 30.9818 24.9422 31.1251 24.5005 31.1251Z"
        fill={color ? color : colors.black}
      />
      <path
        d="M24.4992 27.0417C23.9577 27.0417 23.4384 26.8266 23.0555 26.4437C22.6726 26.0608 22.4575 25.5415 22.4575 25V8.66667C22.4575 8.12518 22.6726 7.60588 23.0555 7.22299C23.4384 6.8401 23.9577 6.625 24.4992 6.625C25.0407 6.625 25.56 6.8401 25.9429 7.22299C26.3257 7.60588 26.5409 8.12518 26.5409 8.66667V25C26.5409 25.5415 26.3257 26.0608 25.9429 26.4437C25.56 26.8266 25.0407 27.0417 24.4992 27.0417Z"
        fill={color ? color : colors.black}
      />
    </svg>
  )
}
