interface IAddresses {
  [chainId: number]: {
    UNIC_FACTORY_ADDRESS: string
    UNIC_MAPPER_ADDRESS: string
  }
}

export const addresses: IAddresses = {
  //ETH MAINNET
  1: {
    UNIC_FACTORY_ADDRESS: "",
    UNIC_MAPPER_ADDRESS: "",
  },
  //POLYGON
  137: {
    UNIC_FACTORY_ADDRESS: "0x287fAb9bf5F74d41B3627CE883f854fB289e388E",
    UNIC_MAPPER_ADDRESS: "0x4D46c584A47ed0B8F5b5B569Bf20b8328d39fca3",
  },
  //EVMOS
  9001: {
    UNIC_FACTORY_ADDRESS: "0xc8753345C072AD81FC08d48fa7A7E1Ab31568651",
    UNIC_MAPPER_ADDRESS: "0x88c29719C7B28af24c2597F2B2D39E505E0B65F3",
  },
  //OPTIMISM
  10: {
    UNIC_FACTORY_ADDRESS: "0xd2Fc928b9dea02b9c82C5e0423dB9b14C8Eb0764",
    UNIC_MAPPER_ADDRESS: "0x4D46c584A47ed0B8F5b5B569Bf20b8328d39fca3",
  },
}
