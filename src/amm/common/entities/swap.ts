import type {Address, TokenId} from "ergo-lib-wasm-browser"
import {AssetAmount, PublicKey} from "@ergolabs/ergo-sdk"

export type Swap = {
  readonly pk: PublicKey
  readonly poolAddress: Address
  readonly quoteAsset: TokenId
  readonly minQuoteOutput: bigint
  readonly baseInput: AssetAmount
  readonly timestamp: number
}
