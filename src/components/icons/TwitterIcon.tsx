export default function TwitterIcon({ ...props }) {
  const { color } = props
  return (
    <svg viewBox="0 0 22 18" {...props} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.6502 2.21749C20.8599 2.57207 20.0105 2.81087 19.119 2.91851C20.0293 2.36764 20.7283 1.49476 21.0568 0.454541C20.2056 0.964701 19.2622 1.33556 18.258 1.53547C17.4551 0.669821 16.3085 0.128906 15.0411 0.128906C12.1958 0.128906 10.1049 2.81177 10.7476 5.59685C7.08591 5.41142 3.83866 3.63852 1.66458 0.943897C0.509961 2.94564 1.06579 5.56429 3.02774 6.89034C2.30633 6.86683 1.62609 6.66692 1.03267 6.33315C0.984338 8.3964 2.44775 10.3267 4.56723 10.7563C3.94696 10.9264 3.26762 10.9662 2.57664 10.8323C3.13694 12.6016 4.76415 13.8888 6.69388 13.925C4.84112 15.393 2.50682 16.0488 0.168945 15.7702C2.11926 17.0339 4.43656 17.7711 6.9248 17.7711C15.1074 17.7711 19.7303 10.7871 19.4511 4.52316C20.3121 3.89451 21.0595 3.11027 21.6502 2.21749Z"
        fill={color}
      />
    </svg>
  )
}