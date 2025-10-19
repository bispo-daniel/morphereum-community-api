import { env } from '@/config/index.js';
import { CoinMarketCapResponseSchema, type TokenData } from '@/types/token.js';

const formatChange = (value: number): string => {
  const formattedValue = value.toFixed(2);
  const signal = value > 0 ? '+' : '';
  return `${signal}${formattedValue}%`;
};

const formatLargeNumber = (value: number) => {
  if (value < 1e3) {
    return value.toFixed(0);
  }

  if (value < 1e6) {
    return `${(value / 1e3).toFixed(0)}K`;
  }

  if (value < 1e7) {
    return `${(value / 1e6).toFixed(1)}M`;
  }

  if (value < 1e9) {
    return `${(value / 1e6).toFixed(0)}M`;
  }

  return `${(value / 1e9).toFixed(1)}B`;
};

const formatSupply = (value: number) => {
  return `${(value / 1e6).toFixed(0)}M`;
};

export const tokenData = async () => {
  const myHeaders = new Headers();
  myHeaders.append('X-CMC_PRO_API_KEY', env.CMC_API_TOKEN);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  const baseUrl = `${env.CMC_API_URL}/dex/pairs/quotes/latest`;

  const params = new URLSearchParams({
    contract_address: env.TOKEN_POOL_ADDRESS,
    network_id: env.CMC_SOL_NETWORK_ID,
    aux: env.CMC_API_AUX_FIELDS,
  });

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url, requestOptions);

  const data = await response.json();

  const validatedData = CoinMarketCapResponseSchema.parse(data);

  if (
    !validatedData.data ||
    !validatedData.data[0] ||
    !validatedData.data[0].quote ||
    !validatedData.data[0].quote[0]
  ) {
    return null;
  }

  const tokenQuoteBase = validatedData.data[0].quote[0];
  const tokenDataBase = validatedData.data[0];

  const tokenPriceInUSD = `$${Number(tokenQuoteBase?.price.toFixed(5)) || 0}`;
  const volumeIn24H = '$' + formatLargeNumber(tokenQuoteBase?.volume_24h || 0);
  const changeIn1H = formatChange(tokenQuoteBase?.percent_change_price_1h || 0);
  const changeIn24H = formatChange(
    tokenQuoteBase?.percent_change_price_24h || 0
  );
  const marketCap = formatLargeNumber(tokenQuoteBase?.fully_diluted_value || 0);
  const buy24H = formatLargeNumber(tokenDataBase?.['24h_no_of_buys'] || 0);
  const sell24H = formatLargeNumber(tokenDataBase?.['24h_no_of_sells'] || 0);
  const transactions24H = formatLargeNumber(
    tokenDataBase?.num_transactions_24h || 0
  );
  const totalSupply = formatSupply(tokenDataBase?.total_supply_base_asset || 0);

  const formattedData: TokenData = {
    tokenPriceInUSD,
    volumeIn24H,
    changeIn1H,
    changeIn24H,
    marketCap,
    buy24H,
    sell24H,
    transactions24H,
    totalSupply,
    holders: tokenDataBase?.holders || 0,
  };

  return formattedData;
};
