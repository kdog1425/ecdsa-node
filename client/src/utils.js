import { v4 as uuidv4 } from "uuid";
import { keccak256 } from "ethereumjs-util";
import { Buffer } from "buffer";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";

function signMessage(privateKey, message) {
  // Hash the payload using keccak256
  const messageHash = keccak256(Buffer.from(message));

  // Sign the payload hash with the private key
  return secp256k1.sign(messageHash, Buffer.from(privateKey.slice(2), "hex"));
}

export const createPayload = (privateKey, amount, from, to) => {
  const nonce = uuidv4();
  const message = JSON.stringify({ amount, from, to, nonce });
  return {
    message: message,
    sig: signMessage(privateKey, message).toCompactHex(),
  };
};
