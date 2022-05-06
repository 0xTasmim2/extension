import ChainService from "../../chain"
import { AddressOnNetwork, NameOnNetwork } from "../../../accounts"
import { ETHEREUM, POLYGON } from "../../../constants"
import { sameNetwork } from "../../../networks"
import { NameResolver } from "../name-resolver"

const supportedNetworks = [ETHEREUM, POLYGON]

export default function ensResolverFor(
  chainService: ChainService
): NameResolver<"ENS"> {
  return {
    type: "ENS",
    canAttemptNameResolution(): boolean {
      return true
    },
    canAttemptAvatarResolution(addressOrNameOnNetwork: NameOnNetwork): boolean {
      if ("name" in addressOrNameOnNetwork) {
        return this.canAttemptAddressResolution(addressOrNameOnNetwork)
      }
      return true
    },
    canAttemptAddressResolution({ name, network }: NameOnNetwork): boolean {
      return (
        name.endsWith(".eth") &&
        !!supportedNetworks.find((supportedNetwork) =>
          sameNetwork(network, supportedNetwork)
        )
      )
    },

    async lookUpAddressForName({
      name,
      network,
    }: NameOnNetwork): Promise<AddressOnNetwork | undefined> {
      // Lets assume that we can use ENS to look up names for any EVM compatible chain for now.
      if (network.family !== "EVM") {
        return undefined
      }

      const address = await chainService
        // Allow ENS lookups when on Arbitrum, Polygon, Optimism, etc..
        .providerForNetwork(ETHEREUM)
        ?.resolveName(name)

      if (address === undefined || address === null) {
        return undefined
      }

      return {
        address,
        network,
      }
    },
    async lookUpAvatar(
      addressOrNameOnNetwork: AddressOnNetwork | NameOnNetwork
    ) {
      const { network } = addressOrNameOnNetwork

      const { name } =
        "name" in addressOrNameOnNetwork
          ? addressOrNameOnNetwork
          : (await this.lookUpNameForAddress(addressOrNameOnNetwork)) ?? {
              name: undefined,
            }

      const provider = chainService.providerForNetwork(network)

      if (name === undefined || provider === undefined) {
        return undefined
      }

      const { url: avatarUrn } = (await (
        await provider.getResolver(name)
      )?.getAvatar()) ?? { url: undefined }

      if (avatarUrn === undefined) {
        return undefined
      }

      return {
        uri: avatarUrn,
        network,
      }
    },
    async lookUpNameForAddress({
      address,
      network,
    }: AddressOnNetwork): Promise<NameOnNetwork | undefined> {
      const name = await chainService
        .providerForNetwork(network)
        ?.lookupAddress(address)

      if (name === undefined || name === null) {
        return undefined
      }

      return {
        name,
        network,
      }
    },
  }
}
