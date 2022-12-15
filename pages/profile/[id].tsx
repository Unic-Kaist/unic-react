export { default } from "containers/profile"

export const getServerSideProps = async (context: any) => {
  const { query } = context
  return {
    props: { tab: query.tab || "" },
  }
}
