import {
  Keypair,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
} from "@stellar/stellar-sdk";
import { Horizon } from "@stellar/stellar-sdk";

const server = new Horizon.Server(
  import.meta.env.VITE_HORIZON_URL ||
  "https://horizon-testnet.stellar.org"
);

const NETWORK = Networks.TESTNET;

// Lazy load sponsor keypair — only when needed, not at file load
function getSponsorKeypair() {
  const secret = import.meta.env.VITE_SPONSOR_SECRET;
  if (!secret) {
    throw new Error("VITE_SPONSOR_SECRET is missing from your frontend/.env file");
  }
  return Keypair.fromSecret(secret);
}

export async function submitWithFeeBump(innerTx) {
  const sponsorKeypair = getSponsorKeypair();

  const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
    sponsorKeypair,
    "200",
    innerTx,
    NETWORK
  );

  feeBumpTx.sign(sponsorKeypair);

  const result = await server.submitTransaction(feeBumpTx);
  return result.hash;
}

export async function sendGaslessPayment(senderSecret, destination, amount) {
  const senderKeypair = Keypair.fromSecret(senderSecret);
  const senderAccount = await server.loadAccount(senderKeypair.publicKey());

  const innerTx = new TransactionBuilder(senderAccount, {
    fee: "100",
    networkPassphrase: NETWORK,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount,
      })
    )
    .setTimeout(30)
    .build();

  innerTx.sign(senderKeypair);
  return await submitWithFeeBump(innerTx);
}