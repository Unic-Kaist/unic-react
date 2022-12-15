import { useCallback } from "react"

import styled from "@emotion/styled"
import { Text } from "components/ui"
import { useModal } from "hooks/useModal"
import Button from "components/ui/Buttons"

export function useComingSoonDialog() {
  const { open, close } = useModal()
  return useCallback(() => {
    open(<ComingSoonModal onClose={close} />)
  }, [open, close])
}

function ComingSoonModal({ onClose }: { onClose: () => void }) {
  return (
    <Container>
      <Text weight={700} size={30}>
        Coming Soon!
      </Text>

      <Text weight={500} size={20}>
        Join our community to keep in touch!
      </Text>

      <Button onClick={onClose}>Close</Button>
    </Container>
  )
}

const Container = styled.div`
  max-width: 450px;
  width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export default ComingSoonModal
