import { ComponentProps, CSSProperties, ForwardedRef, ReactNode } from "react"
import React from "react"

import styled from "@emotion/styled"
import { CubeIcon } from "@heroicons/react/outline"

import { Spacing } from "components/layout"
import { Text, Typography } from "components/ui"
import { chains } from "constants/chains"
import { colors } from "constants/colors"
import { useChainId } from "hooks/useChainId"
import { coerceCssPixelValue } from "utils/css"
import { CardInfoTab } from "components/InfoTab"

interface Props extends ComponentProps<typeof Container> {
  header: ReactNode
  name: string
  footer?: ReactNode
  attributes?: Object
  hideHover?: boolean
}

export const CommonCard = Object.assign(
  React.forwardRef(function CommonCard(
    { children, name, header, footer, attributes, hideHover, ...rest }: Props,
    ref: ForwardedRef<HTMLDivElement>
  ) {
    return (
      <Container hideHover={hideHover} {...rest} ref={ref}>
        <ContentContainer>{header}</ContentContainer>
        {footer ? (
          <FooterContainer>{footer}</FooterContainer>
        ) : (
          <FooterContainer>
            <Text weight={700} color={colors.black}>
              {name}
            </Text>
            <Spacing height={10} />
            {Boolean(attributes) && (
              <AttributeContainer>
                {Object.entries(attributes).map(([key, value], i) => (
                  <CardInfoTab key={i} title={key} content={value} />
                ))}
              </AttributeContainer>
            )}
            {children}
          </FooterContainer>
        )}
      </Container>
    )
  }),
  {
    Image,
  }
)

const Container = styled.div<{ hideHover?: boolean }>`
  border: 1px solid ${colors.gray5};
  border-radius: 10px;
  cursor: pointer;
  transition: transform 300ms;
  &:hover {
    transform: ${(p) => (p.hideHover ? "" : "translateY(-2px)")};
  }
`

const ContentContainer = styled.div`
  padding: 4px;
`

const FooterContainer = styled.div`
  padding: 12px 12px 20px;
`

const AttributeContainer = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
`

interface ImageProps extends ComponentProps<typeof ImageContainer> {
  name?: string
  url?: string
}

function Image({ name, url, ...props }: ImageProps) {
  return (
    <ImageContainer {...props}>
      <RectangleImageContainer>
        {url ? (
          <StyledImage src={url} alt={name} />
        ) : (
          <Center style={{ background: colors.gray5 }}>
            {/* <CubeIcon
              width="30%"
              color={colors.gray4}
              style={{ opacity: 0.5, marginBottom: 20 }}
            /> */}
          </Center>
        )}
      </RectangleImageContainer>
      {props.children}
    </ImageContainer>
  )
}

const RectangleImageContainer = styled.div`
  position: relative;
  width: 100%;

  &::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }

  & > * {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ImageContainer = styled.div<{
  width?: CSSProperties["width"]
  height?: CSSProperties["height"]
}>`
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  width: ${(p) => coerceCssPixelValue(p.width)};
  height: ${(p) => coerceCssPixelValue(p.height ?? p.width)};
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
