import {AssetAmount, PublicKey, TokenId} from "@ergolabs/ergo-sdk"
import {ExFee, ExFeePerToken, ExFeeType} from "../../../types"
import {PoolId} from "../types"

export type SwapParams<F extends ExFeeType> = {
  readonly pk: PublicKey
  readonly poolId: PoolId
  readonly poolFeeNum: number
  readonly baseInput: AssetAmount
  readonly quoteAsset: TokenId
  readonly minQuoteOutput: bigint
  readonly exFeePerToken: ExFeePerToken<F>
  readonly maxExFee: ExFee<F>
  readonly uiFee: bigint
}
