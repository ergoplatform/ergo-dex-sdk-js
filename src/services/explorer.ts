import {ErgoTreeHex, ErgoTreeTemplateHashHex} from "../types";
import {ErgoBox} from "ergo-lib-wasm-browser";
import {TokenId} from "../wallet/types";

export interface Explorer {

    /** Get unspent boxes with a given ErgoTree.
     */
    getUnspentByErgoTree(tree: ErgoTreeHex): Promise<ErgoBox[]>

    /** Get unspent boxes with scripts matching a given template hash.
     */
    getUnspentByErgoTreeTemplate(templateHash: ErgoTreeTemplateHashHex): Promise<ErgoBox[]>

    /** Get unspent boxes containing a token with given id.
     */
    getUnspentByTokenId(tokenId: TokenId): Promise<ErgoBox[]>
}