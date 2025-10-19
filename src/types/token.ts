import { z } from 'zod';

export const CoinMarketCapResponseSchema = z.object({
  data: z.array(
    z.object({
      quote: z.array(
        z.object({
          convert_id: z.string(),
          price: z.number(),
          price_by_quote_asset: z.number(),
          last_updated: z.string(),
          volume_24h: z.number(),
          percent_change_price_1h: z.number(),
          percent_change_price_24h: z.number(),
          liquidity: z.number(),
          fully_diluted_value: z.number(),
        })
      ),
      contract_address: z.string(),
      name: z.string(),
      base_asset_id: z.string(),
      base_asset_ucid: z.string().nullable(),
      base_asset_name: z.string(),
      base_asset_symbol: z.string(),
      base_asset_contract_address: z.string(),
      quote_asset_id: z.string(),
      quote_asset_ucid: z.string(),
      quote_asset_name: z.string(),
      quote_asset_symbol: z.string(),
      quote_asset_contract_address: z.string(),
      dex_id: z.string(),
      dex_slug: z.string(),
      network_id: z.string(),
      network_slug: z.string(),
      last_updated: z.string(),
      created_at: z.string(),
      num_transactions_24h: z.number(),
      holders: z.number().nullable(),
      '24h_no_of_buys': z.number(),
      '24h_no_of_sells': z.number(),
      total_supply_base_asset: z.number(),
    })
  ),
  status: z.object({
    timestamp: z.string(),
    error_code: z.string(),
    error_message: z.string().nullable(),
    elapsed: z.number(),
    credit_count: z.number(),
  }),
});

export type CoinMarketCapResponse = z.infer<typeof CoinMarketCapResponseSchema>;

export const TokenDataSchema = z.object({
  tokenPriceInUSD: z.string(),
  volumeIn24H: z.string(),
  changeIn1H: z.string(),
  changeIn24H: z.string(),
  marketCap: z.string(),
  transactions24H: z.string(),
  sell24H: z.string(),
  buy24H: z.string(),
  totalSupply: z.string(),
  holders: z.number(),
});

export type TokenData = z.infer<typeof TokenDataSchema>;
