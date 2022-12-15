import { colors } from "constants/colors"
import React from "react"

export default function StarIcon({ ...props }) {
  const { color, filled } = props
  return !filled ? (
    <svg {...props} viewBox="0 0 217 217" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M158.508 189.561C157.064 189.567 155.64 189.226 154.356 188.568L108.32 164.467L62.2839 188.568C60.789 189.354 59.1036 189.705 57.4192 189.581C55.7348 189.457 54.1191 188.863 52.7556 187.866C51.3921 186.869 50.3357 185.51 49.7063 183.942C49.0769 182.375 48.8998 180.663 49.1952 179L58.2219 128.18L21.0321 92.0732C19.8718 90.9153 19.0487 89.4633 18.6511 87.8731C18.2535 86.2828 18.2965 84.6143 18.7754 83.0466C19.2986 81.4423 20.261 80.0168 21.5534 78.9318C22.8458 77.8469 24.4164 77.1459 26.087 76.9084L77.5389 69.4163L100.196 23.1096C100.935 21.5835 102.089 20.2964 103.526 19.3958C104.963 18.4952 106.624 18.0176 108.32 18.0176C110.016 18.0176 111.677 18.4952 113.114 19.3958C114.551 20.2964 115.705 21.5835 116.444 23.1096L139.371 69.326L190.823 76.8182C192.494 77.0556 194.065 77.7566 195.357 78.8416C196.649 79.9265 197.612 81.352 198.135 82.9563C198.614 84.524 198.657 86.1925 198.259 87.7828C197.862 89.3731 197.039 90.8251 195.878 91.9829L158.689 128.09L167.715 178.91C168.037 180.602 167.869 182.351 167.229 183.951C166.589 185.55 165.505 186.933 164.105 187.936C162.47 189.082 160.502 189.653 158.508 189.561V189.561ZM108.32 145.33C109.767 145.294 111.198 145.636 112.472 146.323L146.503 164.377L140.003 126.374C139.751 124.923 139.858 123.433 140.314 122.032C140.77 120.632 141.562 119.365 142.621 118.341L169.701 91.8927L131.789 86.2962C130.399 86.0163 129.094 85.4127 127.981 84.5345C126.867 83.6562 125.976 82.528 125.38 81.2412L108.32 47.3913L91.2594 81.2412C90.6063 82.5384 89.6499 83.6588 88.4713 84.5074C87.2927 85.356 85.9268 85.9077 84.4894 86.1156L46.5775 91.7121L73.6575 118.16C74.7161 119.184 75.5081 120.452 75.9643 121.852C76.4206 123.252 76.5273 124.743 76.2752 126.194L69.776 163.745L103.806 145.692C105.248 145.155 106.811 145.03 108.32 145.33V145.33Z"
        fill={color ? color : colors.black}
      />
    </svg>
  ) : (
    <svg {...props} viewBox="0 0 217 217" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M158.508 189.561C157.064 189.567 155.64 189.226 154.356 188.568L108.32 164.467L62.2839 188.568C60.789 189.354 59.1036 189.705 57.4192 189.581C55.7348 189.457 54.1191 188.863 52.7556 187.866C51.3921 186.869 50.3357 185.51 49.7063 183.942C49.0769 182.375 48.8998 180.663 49.1952 179L58.2219 128.18L21.0321 92.0732C19.8718 90.9153 19.0487 89.4633 18.6511 87.8731C18.2535 86.2828 18.2965 84.6143 18.7754 83.0466C19.2986 81.4423 20.261 80.0168 21.5534 78.9318C22.8458 77.8469 24.4164 77.1459 26.087 76.9084L77.5389 69.4163L100.196 23.1096C100.935 21.5835 102.089 20.2964 103.526 19.3958C104.963 18.4952 106.624 18.0176 108.32 18.0176C110.016 18.0176 111.677 18.4952 113.114 19.3958C114.551 20.2964 115.705 21.5835 116.444 23.1096L139.371 69.326L190.823 76.8182C192.494 77.0556 194.065 77.7566 195.357 78.8416C196.649 79.9265 197.612 81.352 198.135 82.9563C198.614 84.524 198.657 86.1925 198.259 87.7828C197.862 89.3731 197.039 90.8251 195.878 91.9829L158.689 128.09L167.715 178.91C168.037 180.602 167.869 182.351 167.229 183.951C166.589 185.55 165.505 186.933 164.105 187.936C162.47 189.082 160.502 189.653 158.508 189.561V189.561Z"
        fill={color ? color : colors.black}
      />
    </svg>
  )
}
