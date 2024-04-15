import { AssetInfo, OraiswapOrderbookClient, OraiswapTokenQueryClient } from "@oraichain/oraidex-contracts-sdk";
import { OrderDirection, OrderResponse } from "@oraichain/oraidex-contracts-sdk/build/OraiswapOrderbook.types";
import { SimulateCosmWasmClient } from "@oraichain/cw-simulate";
import { toDisplay } from "@oraichain/oraidex-common";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export async function queryAllOrdersOfBidderWithDirection(
    orderbookClient: OraiswapOrderbookClient,
    sender: string,
    assetInfos: [AssetInfo, AssetInfo],
    direction: OrderDirection,
    limit?: number,
    orderBy?: number
  ): Promise<OrderResponse[]> {
    let totalOrders: OrderResponse[] = [];
    let orderQuery = {
      assetInfos: assetInfos,
      orderBy: orderBy ?? 1,
      limit: limit ?? 100,
      filter: {
        bidder: sender
      },
      direction
    };
    while (true) {
      try {
        const mmOrders = await orderbookClient.orders(orderQuery);
        if (mmOrders.orders.length === 0) break;
        totalOrders = totalOrders.concat(mmOrders.orders);
        const lastOrderId = mmOrders.orders[mmOrders.orders.length - 1].order_id;
        orderQuery["startAfter"] = lastOrderId;
      } catch (error) {
        // do nothing, it will retry in the next loop
      }
    }
    return totalOrders;
  }

export async function queryAllOrdersOfBidder(client:OraiswapOrderbookClient, sender:string, assetInfos: [AssetInfo, AssetInfo], limit?: number): Promise<OrderResponse[]> {
    const results = await Promise.all([
      queryAllOrdersOfBidderWithDirection(client, sender, assetInfos, "buy", limit),
      queryAllOrdersOfBidderWithDirection(client, sender, assetInfos,"sell", limit)
    ]);
    const tempOrders = [...results[0], ...results[1]];
    const key = "order_id";
    const ordersMap = new Set();
    return tempOrders.filter((order) => {
      if (!ordersMap.has(order[key])) {
        ordersMap.add(order[key]);
        return true;
      }
      return false;
    });
  }

export interface MinimalOrder {
  price: number;
  amount: string;
  total: string;
}

export interface DisplayOrder {
    price: number;
    baseAmount: number;
    totalQuoteAmount: number;
    depth: string;
}

export const displayOrderDepth = (totalQuoteAmount: number): string => {
  const totalDepth = (totalQuoteAmount / 2).toFixed(0);
  let depthDisplay = "";
  for (let i = 0; i < Number(totalDepth); i++) {
    depthDisplay += ".";
  }
  return depthDisplay;
};

export const calculateOrderPrice = (offerAmount: string, askAmount: string, orderDirection: OrderDirection): number => {
  if (orderDirection === "buy") return Number(offerAmount) / Number(askAmount);
  return Number(askAmount) / Number(offerAmount);
};

export const toDisplayOrders = (orders: OrderResponse[],  baseDecimals = 6, quoteDecimals = 6) => {
  const buyOrders = orders
    .filter((order) => order.direction === "buy")
    .map((order) => ({
      price: calculateOrderPrice(order.offer_asset.amount, order.ask_asset.amount, order.direction),
      baseAmount: toDisplay(order.ask_asset.amount, baseDecimals, baseDecimals),
      totalQuoteAmount: toDisplay(order.offer_asset.amount, quoteDecimals, quoteDecimals),
      depth: displayOrderDepth(toDisplay(order.offer_asset.amount, quoteDecimals, quoteDecimals))
    }))
    .sort((a, b) => b.price - a.price);
  const sellOrders = orders
    .filter((order) => order.direction === "sell")
    .map((order) => ({
      price: calculateOrderPrice(order.offer_asset.amount, order.ask_asset.amount, order.direction),
      baseAmount: toDisplay(order.offer_asset.amount, baseDecimals, baseDecimals),
      totalQuoteAmount: toDisplay(order.ask_asset.amount, quoteDecimals, quoteDecimals),
      depth: displayOrderDepth(toDisplay(order.ask_asset.amount, quoteDecimals, quoteDecimals))
    }))
    .sort((a, b) => b.price - a.price);
  return [buyOrders, sellOrders];
};

export const displayOrderbook = (sellOrders: DisplayOrder[], buyOrders: DisplayOrder[] ,midPrice: string ) => {
  const sortedOrders = [
    {
      price: "sell ===================",
      baseAmount: "sell ===================",
      totalQuoteAmount: "sell ==================="
    },
    ...sellOrders,
    {
      price: midPrice,
      baseAmount: "mid ===================",
      totalQuoteAmount: "mid ==================="
    },
    ...buyOrders,
    {
      price: "buy ===================",
      baseAmount: "buy ===================",
      totalQuoteAmount: "buy ==================="
    }
  ];
  console.table(sortedOrders);
};

async function queryBestTick(orderbookClient: OraiswapOrderbookClient, assetInfos:[AssetInfo, AssetInfo], direction: OrderDirection): Promise<number> {
    let tickQuery = {
      assetInfos: assetInfos,
      orderBy: direction === "buy" ? 2 : 1,
      limit: 1,
      direction
    };
    const ticks = await orderbookClient.ticks(tickQuery);
    if (!ticks || ticks.ticks.length === 0) return -1;
    return +ticks.ticks[0].price;
  }

export const getSpreadPrice = (price: number, spreadDecimal: number, desDecimals = 6) => {
  return Number((price * (1 + spreadDecimal)).toFixed(desDecimals));
}

export async function getBalances(client:CosmWasmClient, address:string, assetInfos:AssetInfo[]){
  const promiseGetBalances = assetInfos.map(async(assetInfo)=>{
    if("native_token" in assetInfo){
      const balance = (await client.getBalance(address, assetInfo.native_token.denom)).amount;
      return BigInt(balance)
    }
    const oraiSwapToken = new OraiswapTokenQueryClient(client, assetInfo.token.contract_addr);
    const balance = await oraiSwapToken.balance({address});
    return BigInt(balance.balance)
  })
  return await Promise.all(promiseGetBalances)

}
