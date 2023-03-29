import {ErgoTree, PublicKey, RustModule, TokenId} from "@ergolabs/ergo-sdk"
import {ErgoTreePrefixHex, SigmaPropConstPrefixHex} from "../../amm/common/constants"
import {fromHex} from "../../utils/hex"
import {PoolId} from "../types"
import {StakingBundleTreeBlake2b256} from "./templates"

export const depositSample =
  "1988041604000e2002020202020202020202020202020202020202020202020202020202020202" +
  "0204020e2000000000000000000000000000000000000000000000000000000000000000000404" +
  "040008cd02217daf90deb73bdf8b6709bb42093fdfaff6573fd47b630e2d3fdd4a8193a74d0400" +
  "05fcffffffffffffffff0104000e2037687656669e6173e60c5671238d0518002768f7371d0b01" +
  "a44c6dd56025706104060400040804140402050204040e691005040004000e36100204a00b08cd" +
  "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a" +
  "8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a573010074730273" +
  "03830108cdeeac93b1a573040500050005a09c01d808d601b2a4730000d602db63087201d60373" +
  "01d604b2a5730200d6057303d606c57201d607b2a5730400d6088cb2db6308a773050002eb0273" +
  "06d1ededed938cb27202730700017203ed93c27204720593860272067308b2db63087204730900" +
  "ededededed93cbc27207730a93d0e4c672070608720593e4c67207070e72039386028cb2720273" +
  "0b00017208b2db63087207730c009386028cb27202730d00019c72087e730e05b2db6308720773" +
  "0f0093860272067310b2db6308720773110090b0ada5d90109639593c272097312c17209731373" +
  "14d90109599a8c7209018c7209027315"

export const depositTemplate =
  "d808d601b2a4730000d602db63087201d6037301d604b2a57" +
  "30200d6057303d606c57201d607b2a5730400d6088cb2db6308a773050002eb027306d1ededed9" +
  "38cb27202730700017203ed93c27204720593860272067308b2db63087204730900ededededed9" +
  "3cbc27207730a93d0e4c672070608720593e4c67207070e72039386028cb27202730b00017208b" +
  "2db63087207730c009386028cb27202730d00019c72087e730e05b2db63087207730f009386027" +
  "2067310b2db6308720773110090b0ada5d90109639593c272097312c1720973137314d90109599" +
  "a8c7209018c7209027315"

export const redeemSample =
  "19ad020a040208cd02217daf90deb73bdf8b6709bb42093fdfaff6573fd47b630e2d3fdd4a" +
  "8193a74d0e2001010101010101010101010101010101010101010101010101010101010101" +
  "010e20000000000000000000000000000000000000000000000000000000000000000005d0" +
  "0f04000e691005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07" +
  "029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d196" +
  "83030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a5730405" +
  "00050005a09c01d801d601b2a5730000eb027301d1eded93c27201730293860273037304b2" +
  "db6308720173050090b0ada5d90102639593c272027306c1720273077308d90102599a8c72" +
  "02018c7202027309"

export const redeemTemplate =
  "d801d601b2a5730000eb027301d1eded93c27201730293" +
  "860273037304b2db6308720173050090b0ada5d90102639593c272027306c1720273077308" +
  "d90102599a8c7202018c7202027309"

export function deposit(
  poolId: PoolId,
  redeemerPk: PublicKey,
  expectedNumEpochs: number,
  minerFee: bigint
): ErgoTree {
  return RustModule.SigmaRust.ErgoTree.from_base16_bytes(depositSample)
    .with_constant(1, RustModule.SigmaRust.Constant.from_byte_array(fromHex(poolId)))
    .with_constant(
      3,
      RustModule.SigmaRust.Constant.from_byte_array(
        fromHex(ErgoTreePrefixHex + SigmaPropConstPrefixHex + redeemerPk)
      )
    )
    .with_constant(6, RustModule.SigmaRust.Constant.decode_from_base16(SigmaPropConstPrefixHex + redeemerPk))
    .with_constant(10, RustModule.SigmaRust.Constant.from_byte_array(fromHex(StakingBundleTreeBlake2b256)))
    .with_constant(14, RustModule.SigmaRust.Constant.from_i32(expectedNumEpochs))
    .with_constant(
      21,
      RustModule.SigmaRust.Constant.from_i64(RustModule.SigmaRust.I64.from_str(minerFee.toString()))
    )
    .to_base16_bytes()
}

export function redeem(
  redeemerPk: PublicKey,
  lqId: TokenId,
  expectedLqAmount: bigint,
  minerFee: bigint
): ErgoTree {
  return RustModule.SigmaRust.ErgoTree.from_base16_bytes(redeemSample)
    .with_constant(1, RustModule.SigmaRust.Constant.decode_from_base16(SigmaPropConstPrefixHex + redeemerPk))
    .with_constant(
      2,
      RustModule.SigmaRust.Constant.from_byte_array(
        fromHex(ErgoTreePrefixHex + SigmaPropConstPrefixHex + redeemerPk)
      )
    )
    .with_constant(3, RustModule.SigmaRust.Constant.from_byte_array(fromHex(lqId)))
    .with_constant(
      4,
      RustModule.SigmaRust.Constant.from_i64(RustModule.SigmaRust.I64.from_str(expectedLqAmount.toString()))
    )
    .with_constant(
      9,
      RustModule.SigmaRust.Constant.from_i64(RustModule.SigmaRust.I64.from_str(minerFee.toString()))
    )
    .to_base16_bytes()
}
