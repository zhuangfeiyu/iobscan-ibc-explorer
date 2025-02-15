import { Ref } from 'vue';
import { IRequestPagination, IResponsePageInfo } from './index.interface';

export interface IChainsListParams extends IRequestPagination {
    loading?: Ref<boolean>;
}
export interface IResponseChainsListItem {
    chainName: string;
    chain_id: string;
    channels: number;
    connected_chains: number;
    currency: string;
    ibc_tokens: number;
    ibc_tokens_value: string;
    relayers: number;
    transfer_txs: number;
    transfer_txs_value: string;
}

export interface IResponseChainsList {
    items: IResponseChainsListItem[];
    page_info: IResponsePageInfo;
}
