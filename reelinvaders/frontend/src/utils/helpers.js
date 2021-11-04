import { transactions, passphrase } from "@liskhq/lisk-client";

export const formatBalance = (balance) => {
  return transactions.convertBeddowsToLSK(balance.toString());
};

export const generateNewAccount = () => {
  let pass = passphrase.Mnemonic.generateMnemonic();
  return pass;
};
