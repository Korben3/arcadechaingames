import { apiClient, transactions } from "@liskhq/lisk-client";
import { NODE, FUNDPASSPHRASE, FUNDAMOUNT } from "../config/config.json";

const RPC_ENDPOINT = NODE;

export const getClient = async () => {
  let clientCache;
  if (!RPC_ENDPOINT) {
    throw new Error("No RPC endpoint defined");
  }
  if (!clientCache) {
    clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
  }
  return clientCache;
};

export const getAccount = async (address) => {
  const client = await getClient();
  try {
    const account = await client.account.get(address);
    return account;
  } catch (e) {
    console.log(e);
    return "notFound";
  }
};

export const sendSpinReelTransaction = async (passphrase) => {
  const client = await getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1001,
      assetID: 1,
      fee: BigInt(transactions.convertLSKToBeddows("2")),
      asset: {},
    },
    passphrase
  );

  client.transaction
    .send(tx)
    .then((res) => {
      console.log(res);
    })
    .catch((res) => {
      console.log(res);
    });

  return tx.id.toString("hex");
};

export const fundAccount = async (address) => {
  const client = await getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 2,
      assetID: 0,
      fee: BigInt(transactions.convertLSKToBeddows("0.002")),
      asset: {
        amount: BigInt(transactions.convertLSKToBeddows(FUNDAMOUNT)),
        recipientAddress: address,
        data: "",
      },
    },
    FUNDPASSPHRASE
  );

  client.transaction
    .send(tx)
    .then((res) => {
      console.log(res);
    })
    .catch((res) => {
      console.log(res);
    });
};

export const subscribeToSpinreel = async (handler) => {
  const client = await getClient();
  client.subscribe("reelinvaders:spinreel", (e) => handler(e));
};

// export const unSubscribeToSpinreel = async () => {
//   const client = await getClient();
//   client.unsubscribe("reelinvaders:spinreel");
// }; v6
