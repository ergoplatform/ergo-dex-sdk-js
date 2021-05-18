import {PoolSetupParams} from "../models/poolSetupParams";
import {SwapParams} from "../models/swapParams";
import {TransactionContext} from "../../wallet/models/transactionContext";
import {ErgoTx} from "../../wallet/entities/ergoTx";
import {DepositParams} from "../models/depositParams";
import {RedeemParams} from "../models/redeemParams";

export interface PoolOpsInterpreter {

    /** Interpret `setup` operation on a pool to a chain of transactions.
     */
    setup(params: PoolSetupParams, ctx: TransactionContext): Promise<ErgoTx[]>

    /** Interpret `deposit` operation on a pool to a transaction.
     */
    deposit(params: DepositParams, ctx: TransactionContext): Promise<ErgoTx>

    /** Interpret `redeem` operation on a pool to a transaction.
     */
    redeem(params: RedeemParams, ctx: TransactionContext): Promise<ErgoTx>

    /** Interpret `swap` operation on a pool to a transaction.
     */
    swap(params: SwapParams, ctx: TransactionContext): Promise<ErgoTx>
}
