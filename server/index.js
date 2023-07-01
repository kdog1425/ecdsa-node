import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereumjs-util";
import express from "express";
import cors from "cors";
import { balances, findUserByPublicKey } from "./users.js";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const user = findUserByPublicKey(address);
  if (!user) {
    console.log("user not found");
    res.status(400).send({ message: "No such address!" });
    return;
  }
  const balance = balances[user] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO:
  // 1. get a signature from the client side
  // 2. recvoer the public address from the signature.
  const { sender, payload, recipient } = req.body;
  const { amount } = JSON.parse(payload.message);
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[findUserByPublicKey(sender)] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
    return;
  }
  const signature = recover(payload.sig);
  if (!verifySecp256k1Signature(sender, payload.message, signature)) {
    res.status(400).send({ message: "Could not verify signature!" });
    return;
  }
  const senderUser = findUserByPublicKey(sender);
  const recipientUser = findUserByPublicKey(recipient);
  console.log({
    senderUser,
    recipientUser,
    payload,
    amount,
  });
  balances[senderUser] -= amount;
  balances[recipientUser] += amount;
  res.send({ balance: balances[senderUser] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function verifySecp256k1Signature(publicKey, data, sig) {
  publicKey = publicKey.startsWith("0x") ? publicKey.slice(2) : publicKey;
  return secp256k1.verify(
    Buffer.concat([sig.r, sig.s]).toString("hex"),
    keccak256(Buffer.from(data)),
    publicKey
  );
}

const recover = (compactHex) => {
  // Decode the compact hexadecimal string
  const signature = Buffer.from(compactHex, "hex");

  // Recover the signature components
  const r = signature.slice(0, 32);
  const s = signature.slice(32, 64);
  const v = signature[64];
  return { r, s, v };
};
