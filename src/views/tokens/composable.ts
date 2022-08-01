import { getTokensListAPI } from '@/api/tokens';
import { BASE_PARAMS } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { formatBigNumber, getRestString } from '@/helper/parseStringHelper';
import { IResponseTokensList, TTokenListParams } from '@/types/interface/tokens.interface';
import { urlHelper } from '@/utils/urlTools';
import { Ref } from 'vue';

export const useGetTokenList = () => {
    const list = ref([]);
    const total = ref(0);

    const getList = async (params: TTokenListParams = {}) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        try {
            const result = await getTokensListAPI({
                ...BASE_PARAMS,
                ...params
            });
            loading && (loading.value = false);
            const { code, data, message } = result;
            if (code === API_CODE.success) {
                if (!params.use_count) {
                    const { items } = data as IResponseTokensList;
                    const temp: any = [];
                    for (let i = 0; i < (items ?? []).length; i++) {
                        const item: any = items[i];
                        const baseDenom = await getBaseDenomByKey(item.chain_id, item.base_denom);
                        item['name'] = baseDenom
                            ? getRestString(baseDenom.symbol, 6, 0)
                            : getRestString(item.base_denom, 6, 0);
                        temp.push(item);
                    }
                    list.value = temp;
                } else {
                    total.value = data as number;
                }
            } else {
                console.error(message);
            }
        } catch (error) {
            loading && (loading.value = false);
            console.log(error);
        }
    };
    getList({ use_count: true });
    return {
        list,
        total,
        getList
    };
};

export const useQuery = () => {
    const route = useRoute();
    const chainIdQuery = route.query.chain as string;
    const denomQuery = route.query.denom as string;
    const statusQuery = route.query.status as 'Authed' | 'Other';
    return {
        chainIdQuery,
        denomQuery,
        statusQuery
    };
};

export const useSelected = (
    denomQuery: string,
    chainIdQuery: string,
    statusQuery: 'Authed' | 'Other',
    getList: any,
    getIbcChains: any,
    getIbcBaseDenom: any,
    loading: Ref<boolean>
) => {
    let pageUrl = '/tokens';
    const router = useRouter();
    const searchDenom = ref(denomQuery);
    const searchChain = ref<string | undefined>(chainIdQuery);
    const searchStatus = ref<'Authed' | 'Other'>(statusQuery);
    const refreshList = () => {
        getList({
            base_denom: searchDenom.value,
            chain: searchChain.value,
            token_type: searchStatus.value,
            loading: loading
        });
    };
    const onSelectedToken = (denom?: string | number) => {
        if (denom) {
            searchDenom.value = denom as string;
        } else {
            searchDenom.value = '';
        }
        pageUrl = urlHelper(pageUrl, {
            key: 'denom',
            value: denom as string
        });
        router.replace(pageUrl);
        refreshList();
    };
    const onSelectedChain = (chain?: string | number) => {
        searchChain.value = chain ? String(chain) : undefined;
        pageUrl = urlHelper(pageUrl, {
            key: 'chain',
            value: chain as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    const onSelectedStatus = (status?: string | number) => {
        searchStatus.value = status as 'Authed' | 'Other';
        pageUrl = urlHelper(pageUrl, {
            key: 'status',
            value: status as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    onMounted(() => {
        !sessionStorage.getItem('allChains') && getIbcChains();
        getIbcBaseDenom();
        refreshList();
    });
    return {
        searchChain,
        searchDenom,
        searchStatus,
        onSelectedToken,
        onSelectedChain,
        onSelectedStatus
    };
};

export const useRef = () => {
    const chainDropdown = ref();
    const statusDropdown = ref();
    const tokensDropdown = ref();
    return {
        chainDropdown,
        statusDropdown,
        tokensDropdown
    };
};

export const useSubTitleComputed = (
    searchChain: Ref<string | undefined>,
    searchDenom: Ref<string>,
    searchStatus: Ref<'Authed' | 'Other'>,
    total: Ref<number>,
    list: Ref<never[]>
) => {
    const subtitle = computed(() => {
        if (!searchChain.value && !searchStatus.value && !searchDenom.value) {
            return `${formatBigNumber(total.value, 0)} tokens found`;
        } else {
            return `${formatBigNumber(list.value.length, 0)} of the ${formatBigNumber(
                total.value,
                0
            )} tokens found`;
        }
    });
    return {
        subtitle
    };
};

export const useColumnJump = (getBaseDenomInfoByDenom: any) => {
    const router = useRouter();
    const goIbcToken = (denom: string) => {
        router.push({
            path: '/tokens/details',
            query: {
                denom
            }
        });
    };

    const goTransfer = (denom: string, chainId: string) => {
        const baseDenomInfo = getBaseDenomInfoByDenom(denom, chainId);
        const query = baseDenomInfo ? { symbol: baseDenomInfo.symbol } : { denom };
        router.push({
            path: '/transfers',
            query: query
        });
    };
    return {
        goIbcToken,
        goTransfer
    };
};
