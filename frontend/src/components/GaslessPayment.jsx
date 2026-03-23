import { useState } from "react";
import { sendGaslessPayment } from "../stellar/feeSponsor";

export default function GaslessPayment() {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const senderSecret = import.meta.env.VITE_SPONSOR_SECRET;
      const hash = await sendGaslessPayment(senderSecret, destination, amount);
      setTxHash(hash);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <h2>Send Money (Gasless)</h2>
      <p style={{ color: "gray", fontSize: 14 }}>
        No XLM needed for fees — FlowFund sponsors your transaction.
      </p>

      <input
        placeholder="Destination public key (G...)"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 12,
          borderRadius: 6,
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <input
        placeholder="Amount (XLM)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 12,
          borderRadius: 6,
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={handleSend}
        disabled={loading || !destination || !amount}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 6,
          border: "none",
          background: loading ? "#aaa" : "#6C63FF",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: 15,
        }}
      >
        {loading ? "Sending..." : "Send (Fee Sponsored)"}
      </button>

      {txHash && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#e6f9ee",
            borderRadius: 6,
          }}
        >
          <strong>Success!</strong>
          <br />
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, wordBreak: "break-all" }}
          >
            View on Stellar Explorer
          </a>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#fdecea",
            borderRadius: 6,
            color: "#c0392b",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}