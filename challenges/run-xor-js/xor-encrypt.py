#!/usr/bin/env python3
import sys

def encrypt_string(input_string: str, xor_key: int = 0x41) -> list:
    """
    Encrypts a string using XOR encryption with the given key.

    :param input_string: The string to be encrypted.
    :param xor_key: The XOR key (default is 0x41, corresponding to 'A').
    :return: A list of encrypted bytes.
    """
    return [ord(char) ^ xor_key for char in input_string]

def main():
    if len(sys.argv) != 2:
        print("Usage: ./xor-encrypt.py <flag>")
        sys.exit(1)

    flag = sys.argv[1]
    encrypted_bytes = encrypt_string(flag)
    print(encrypted_bytes)

if __name__ == "__main__":
    main()
