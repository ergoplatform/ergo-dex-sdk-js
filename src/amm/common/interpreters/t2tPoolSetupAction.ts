import {
  BoxSelection,
  ByteaConstant,
  EmptyRegisters,
  ErgoBoxCandidate,
  ergoTreeFromAddress,
  extractOutputsFromTxRequest,
  InsufficientInputs,
  Int32Constant,
  MinBoxValue,
  RegisterId,
  registers,
  TransactionContext,
  TxRequest
} from "@ergolabs/ergo-sdk"
import {prepend} from "ramda"
import {stringToBytea} from "../../../utils/utf8"
import {minValueForSetup} from "./mins"
import {BurnLP, EmissionLP} from "../constants"
import * as T2T from "../contracts/t2tPoolContracts"
import {PoolSetupParams} from "../models/poolSetupParams"
import {PoolSetupAction} from "./poolSetupAction"

export class T2tPoolSetupAction implements PoolSetupAction {
  async setup(
    params: PoolSetupParams,
    ctx: TransactionContext,
    uiRewardOut: ErgoBoxCandidate[]
  ): Promise<TxRequest[]> {
    const [x, y] = [params.x.asset, params.y.asset]
    const height = ctx.network.height
    const inputs = ctx.inputs
    const outputGranted = inputs.totalOutputWithoutChange
    const pairIn = [
      outputGranted.assets.filter(t => t.tokenId === x.id),
      outputGranted.assets.filter(t => t.tokenId === y.id)
    ].flat()

    const minNErgs = minValueForSetup(ctx.feeNErgs, params.uiFee)
    if (outputGranted.nErgs < minNErgs)
      return Promise.reject(
        new InsufficientInputs(`Minimal amount of nERG required ${minNErgs}, given ${outputGranted.nErgs}`)
      )
    if (pairIn.length !== 2)
      return Promise.reject(new InsufficientInputs(`Token pair {${x.name}|${y.name}} not provided`))

    const [tickerX, tickerY] = [x.name || x.id.slice(0, 8), y.name || y.id.slice(0, 8)]
    const newTokenLP = {tokenId: inputs.newTokenId, amount: EmissionLP - BurnLP}
    const bootOut: ErgoBoxCandidate = {
      value: outputGranted.nErgs - ctx.feeNErgs - params.uiFee,
      ergoTree: ergoTreeFromAddress(ctx.selfAddress),
      creationHeight: height,
      assets: [newTokenLP, ...pairIn],
      additionalRegisters: registers([
        [RegisterId.R4, new ByteaConstant(stringToBytea(`${tickerX}_${tickerY}_LP`))]
      ])
    }
    const txr0: TxRequest = {
      inputs: inputs,
      dataInputs: [],
      outputs: prepend(bootOut, uiRewardOut),
      changeAddress: ctx.changeAddress,
      feeNErgs: ctx.feeNErgs
    }

    const lpP2Pk = ergoTreeFromAddress(ctx.changeAddress)
    const lpShares = {tokenId: newTokenLP.tokenId, amount: params.outputShare}
    const lpOut: ErgoBoxCandidate = {
      value: MinBoxValue,
      ergoTree: lpP2Pk,
      creationHeight: height,
      assets: [lpShares],
      additionalRegisters: EmptyRegisters
    }

    const poolBootBox = extractOutputsFromTxRequest(txr0, ctx.network)[0]
    const tx1Inputs = BoxSelection.safe(poolBootBox)

    const newTokenNFT = {tokenId: tx1Inputs.newTokenId, amount: 1n}
    const poolAmountLP = newTokenLP.amount - lpShares.amount
    const poolLP = {tokenId: newTokenLP.tokenId, amount: poolAmountLP}
    const poolOut: ErgoBoxCandidate = {
      value: poolBootBox.value - lpOut.value - ctx.feeNErgs,
      ergoTree: T2T.pool(),
      creationHeight: height,
      assets: [newTokenNFT, poolLP, ...poolBootBox.assets.slice(1)],
      additionalRegisters: registers([[RegisterId.R4, new Int32Constant(params.feeNumerator)]])
    }
    const txr1: TxRequest = {
      inputs: tx1Inputs,
      dataInputs: [],
      outputs: [poolOut, lpOut],
      changeAddress: ctx.changeAddress,
      feeNErgs: ctx.feeNErgs
    }

    return Promise.resolve([txr0, txr1])
  }
}
