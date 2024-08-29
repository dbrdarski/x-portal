// aes-gcm-helpers.js

// Function to generate an AES-GCM key
export async function generateKey() {
  return crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true, // whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] // can "encrypt" and "decrypt"
  );
}

// Function to encrypt data using AES-GCM
export async function encryptData(key, data) {
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encodedData
  );
  return {
    iv: iv,
    encryptedData: encryptedData
  };
}

// Function to decrypt data using AES-GCM
export async function decryptData(key, iv, encryptedData) {
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encryptedData
  );
  return JSON.parse(new TextDecoder().decode(decryptedData));
}

// Function to hash data using SHA-256
export async function hashData(data) {
    const encodedData = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
    return new Uint8Array(hashBuffer);
}

// Function to convert the hash to a hexadecimal string
export function bufferToHex(buffer) {
    return Array.prototype.map.call(buffer, x => ('00' + x.toString(16)).slice(-2)).join('');
}

// Function to convert a hexadecimal string back to a Uint8Array (buffer)
export function hexToBuffer(hex) {
    const length = hex.length / 2;
    const buffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        buffer[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return buffer;
}
