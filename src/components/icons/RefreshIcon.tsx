export function RefreshIcon({ size, color, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      <path
        d="M17.6503 6.34989C16.8121 5.50416 15.7946 4.8575 14.6731 4.45768C13.5515 4.05786 12.3544 3.91508 11.1703 4.03989C7.50027 4.40989 4.48027 7.38989 4.07027 11.0599C3.52027 15.9099 7.27027 19.9999 12.0003 19.9999C13.5104 19.9999 14.9895 19.5714 16.2658 18.7642C17.542 17.957 18.5631 16.8043 19.2103 15.4399C19.5303 14.7699 19.0503 13.9999 18.3103 13.9999C17.9403 13.9999 17.5903 14.1999 17.4303 14.5299C16.8497 15.7789 15.8566 16.7899 14.6182 17.3927C13.3797 17.9955 11.9715 18.1534 10.6303 17.8399C8.41027 17.3499 6.62027 15.5399 6.15027 13.3199C5.9527 12.4422 5.95498 11.5312 6.15696 10.6545C6.35893 9.77775 6.75543 8.95764 7.31712 8.25481C7.8788 7.55198 8.59131 6.98442 9.40194 6.59411C10.2126 6.20379 11.1006 6.00071 12.0003 5.99989C13.6603 5.99989 15.1403 6.68989 16.2203 7.77989L14.7103 9.28989C14.0803 9.91989 14.5203 10.9999 15.4103 10.9999H19.0003C19.5503 10.9999 20.0003 10.5499 20.0003 9.99989V6.40989C20.0003 5.51989 18.9203 5.06989 18.2903 5.69989L17.6503 6.34989V6.34989Z"
        fill={color}
      />
    </svg>
  )
}