import styled from "@emotion/styled"
import { Input, Select, Spacing, TextArea, TextButton } from "components/ui"
import DiscordIcon from "components/icons/DiscordIcon"
import WebsiteIcon from "components/icons/WebsiteIcon"
import TwitterIcon from "components/icons/TelegramIcon"
import TelegramIcon from "components/icons/TelegramIcon"
import MediumIcon from "components/icons/MediumIcon"
import Button from "components/ui/Buttons"
import { Upload } from "components/Upload"
import { Collection, CollectionType } from "./explore-tab-bar"
import { useUploaderDialog } from "./Uploader"
import { saveCollection } from "src/api/collections"
import { useUser } from "hooks/useAuth"
import { useMutation } from "react-query"
import { Toast } from "./ui/Toast"
import { useWeb3React } from "@web3-react/core"
import React from "react"

export default function CollectionEdit({
  editedCollection,
  setEditedCollection,
  onClick,
  onSuccess,
  isLoading,
  isNew,
}: {
  editedCollection: Collection
  setEditedCollection: (editedCollection: Collection) => void
  onClick?: (editedCollection: Collection) => Promise<void>
  onSuccess?: () => void
  isLoading?: boolean
  isNew?: boolean
}) {
  const { user } = useUser()
  const openUploader = useUploaderDialog()
  const { account } = useWeb3React()

  const { mutate, isLoading: saveLoading } = useMutation(
    ["collection_save"],
    async () => {
      if (onClick) {
        await onClick({ ...editedCollection })
      } else {
        await saveCollection({
          collection: { ...editedCollection },
          accessToken: user.accessToken,
          userId: user.userId,
        })
      }
    },
    {
      onSuccess: () => {
        onSuccess ? onSuccess() : null
        Toast.success("Collection saved!")
      },
      onError: (error) => {
        Toast.error("Could not save collection. Please try again later.")
        console.log("save_collection error: ", error)
      },
    }
  )

  return (
    <Container>
      <DetailsContainer>
        {/* IMAGE */}
        <DetailsContent>
          <Upload
            src={editedCollection.mainPhoto}
            title="Featured image"
            label="Choose the cover photo of this collection"
            height="150"
            width="150"
            style={{
              borderRadius: "50%",
            }}
            callback={() =>
              openUploader({
                multiple: false,
                callback: (urls: Array<string>) => {
                  setEditedCollection({
                    ...editedCollection,
                    mainPhoto: urls[0],
                  })
                },
              })
            }
          />
          {/* COVER PHOTO */}
          <Upload
            src={editedCollection.coverPhoto}
            label="Choose the cover photo of this collection"
            height="150"
            callback={() =>
              openUploader({
                multiple: false,
                callback: (urls: Array<string>) => {
                  setEditedCollection({
                    ...editedCollection,
                    coverPhoto: urls[0],
                  })
                },
              })
            }
          />
          {/* NAME */}
          <Input
            value={editedCollection.name}
            onChange={(e) => {
              setEditedCollection({ ...editedCollection, name: e.target.value })
            }}
            title="Name"
            size={20}
            placeholder="Collection Name"
          />
          {/* DESCRIPTION */}
          <TextArea
            value={editedCollection.description}
            onChange={(e) => {
              setEditedCollection({
                ...editedCollection,
                description: e.target.value,
              })
            }}
            title="Description"
            label={
              <span>
                The description will be included in this collection’s detail
                page underneath the image.
                <TextButton size={15}>Markdown syntax</TextButton> is supported.
              </span>
            }
            placeholder="Provide a detailed description about this collection."
          />
          {isNew && (
            <React.Fragment>
              {/* SHIPPING REQUIRED */}
              <Select
                value={
                  editedCollection.shippingRequired
                    ? BOOLEAN_BY_TYPE[BooleanType.TRUE]
                    : BOOLEAN_BY_TYPE[BooleanType.FALSE]
                }
                onChange={(value) => {
                  setEditedCollection({
                    ...editedCollection,
                    shippingRequired: value.id == BooleanType.TRUE,
                  })
                }}
                title="Requires shipping"
                label="Does this NFT require physical shipping?"
                options={Object.keys(BooleanType).map((id: BooleanType) => ({
                  id,
                  name: BOOLEAN_BY_TYPE[id],
                }))}
                placeholder="Requires shipping"
              />
              {/* OWNER SIGNATURE ALLOWED */}
              <Select
                value={
                  editedCollection.ownerSignatureMintAllowed
                    ? BOOLEAN_BY_TYPE[BooleanType.TRUE]
                    : BOOLEAN_BY_TYPE[BooleanType.FALSE]
                }
                onChange={(value) => {
                  setEditedCollection({
                    ...editedCollection,
                    ownerSignatureMintAllowed: value.id == BooleanType.TRUE,
                  })
                }}
                title="Owner signature allowed"
                label="Can owners of this NFT create their own invisible signatures?"
                options={Object.keys(BooleanType).map((id: BooleanType) => ({
                  id,
                  name: BOOLEAN_BY_TYPE[id],
                }))}
                placeholder="Owner signature"
              />{" "}
            </React.Fragment>
          )}
          {/* MARKETPLACE */}
          <Input
            value={editedCollection.marketplace}
            onChange={(e) => {
              setEditedCollection({
                ...editedCollection,
                marketplace: e.target.value,
              })
            }}
            title="Marketplace"
            label="This is the default marketplace that your listed NFT will be directed to. (Optional)"
            size={20}
            placeholder="https://opensea.io/handler"
          />
          {/* LISTED */}
          <Select
            value={
              editedCollection.isListed
                ? LISTING_LABEL_BY_TYPE[ListingType.LISTED]
                : LISTING_LABEL_BY_TYPE[ListingType.HIDDEN]
            }
            onChange={(value) => {
              setEditedCollection({
                ...editedCollection,
                isListed: value.id == ListingType.LISTED,
              })
            }}
            title="Listed"
            label="Do you want to make this collection visible on Unic?"
            options={Object.keys(ListingType).map((id: ListingType) => ({
              id,
              name: LISTING_LABEL_BY_TYPE[id],
            }))}
            placeholder="Is Listed"
          />
          {/* CATEGORY */}
          <Select
            value={CATEGORY_LABEL_BY_TYPE[editedCollection.category]}
            onChange={(value) => {
              setEditedCollection({
                ...editedCollection,
                category: value.id,
              })
            }}
            listHeight={300}
            title="Category"
            label="Adding a category will make your collection easily discoverable on Unic."
            options={(
              Object.keys(CollectionType) as Array<keyof typeof CollectionType>
            ).map((id: string) => {
              return {
                id: CollectionType[id],
                name: CATEGORY_LABEL_BY_TYPE[CollectionType[id]],
              }
            })}
            placeholder="Category"
          />
          {/* LINKS */}
          <SocialLinks>
            <Input
              value={editedCollection.socialLinks?.website || ""}
              onChange={(e) => {
                const socialLinks = { ...editedCollection.socialLinks }
                setEditedCollection({
                  ...editedCollection,
                  socialLinks: {
                    ...socialLinks,
                    website: e.target.value,
                  },
                })
              }}
              size={20}
              title="Links"
              label="Adding links will help you promote your collection!"
              placeholder="yourproject.io"
              left={<WebsiteIcon width={20} height={20} />}
            />
            <Input
              value={editedCollection.socialLinks?.twitter || ""}
              onChange={(e) => {
                const socialLinks = { ...editedCollection.socialLinks }
                setEditedCollection({
                  ...editedCollection,
                  socialLinks: {
                    ...socialLinks,
                    twitter: e.target.value,
                  },
                })
              }}
              size={20}
              placeholder="https://twitter.com/your-project"
              left={<TwitterIcon width={20} height={20} />}
            />
            <Input
              value={editedCollection.socialLinks?.discord || ""}
              onChange={(e) => {
                const socialLinks = { ...editedCollection.socialLinks }
                setEditedCollection({
                  ...editedCollection,
                  socialLinks: {
                    ...socialLinks,
                    discord: e.target.value,
                  },
                })
              }}
              size={20}
              placeholder="https://discord.com/your-project"
              left={<DiscordIcon width={20} height={20} />}
            />
            <Input
              value={editedCollection.socialLinks?.telegram || ""}
              onChange={(e) => {
                const socialLinks = { ...editedCollection.socialLinks }
                setEditedCollection({
                  ...editedCollection,
                  socialLinks: {
                    ...socialLinks,
                    telegram: e.target.value,
                  },
                })
              }}
              size={20}
              placeholder="https://telegram.com/your-project"
              left={<TelegramIcon width={20} height={20} />}
            />
            <Input
              value={editedCollection.socialLinks?.medium || ""}
              onChange={(e) => {
                const socialLinks = { ...editedCollection.socialLinks }
                setEditedCollection({
                  ...editedCollection,
                  socialLinks: {
                    ...socialLinks,
                    medium: e.target.value,
                  },
                })
              }}
              size={20}
              placeholder="https://medium.com/your-project"
              left={<MediumIcon width={20} height={20} />}
            />
          </SocialLinks>
          <Button loading={saveLoading || isLoading} onClick={() => mutate()}>
            {isNew ? "Next" : "Save"}
          </Button>
        </DetailsContent>
      </DetailsContainer>
      <Spacing height={30} />
    </Container>
  )
}

export enum ListingType {
  LISTED = "LISTED",
  HIDDEN = "HIDDEN",
}

export enum BooleanType {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

const BOOLEAN_BY_TYPE = {
  [BooleanType.TRUE]: "Yes",
  [BooleanType.FALSE]: "No",
}

const LISTING_LABEL_BY_TYPE = {
  [ListingType.LISTED]: "Listed",
  [ListingType.HIDDEN]: "Hidden",
}

const CATEGORY_LABEL_BY_TYPE = {
  [CollectionType.ALL]: "All",
  [CollectionType.ART]: "Art",
  [CollectionType.FASHION]: "Fashion",
  [CollectionType.DIGITAL]: "Digital",
  [CollectionType.CELEBRITY]: "Celebrity",
  [CollectionType.GAME]: "Game",
  [CollectionType.BRANDS]: "Brands",
  [CollectionType.COLLECTIBLES]: "Collectibles",
  [CollectionType.SPORTS]: "Sports",
  [CollectionType.MUSIC]: "Music",
}

const Container = styled.div`
  flex-direction: column;
  height: 100vh;
`

const DetailsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

const DetailsContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  padding: 0px 24px;
  gap: 25px;
`

const SocialLinks = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 5px;
`
