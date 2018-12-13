
import bitcoin, hashlib, binascii, base58

def private_key_to_public_key(privateKeyHex: str) -> (int, int):
  privateKey = int(privateKeyHex, 16)
  return bitcoin.fast_multiply(bitcoin.G, privateKey)

def pubkey_to_address(pubKey: str, magic_byte = 0) -> str:
  pubKeyBytes = binascii.unhexlify(pubKey)
  sha256val = hashlib.sha256(pubKeyBytes).digest()
  ripemd160val = hashlib.new('ripemd160', sha256val).digest()
  print (binascii.hexlify(ripemd160val))
  return bitcoin.bin_to_b58check(ripemd160val, magic_byte)

privateKeyWIF = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ"
first_encode = base58.b58decode(privateKeyWIF)
private_key_full = binascii.hexlify(first_encode)

# remove version byte, compression byte, checksum
private_key = private_key_full[2:-8] 
print(private_key)

public_key = private_key_to_public_key(private_key)
print("Public key (x,y) coordinates:", public_key)

compressed_public_key = bitcoin.compress(public_key)
print("Public key (hex compressed):", compressed_public_key)

address = pubkey_to_address(compressed_public_key)
print("Compressed Bitcoin address (base58check):", address)