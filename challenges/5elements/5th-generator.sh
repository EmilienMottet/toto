#!/bin/bash

# Check if the flag was passed as an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <flag>"
    exit 1
fi

FLAG=$1
VAULT_PASSWORD="leeloo" # Password for ansible-vault
FLAG_FILE="./static/D4554ULT/gct/5/master/SearchFlag.txt"
ZIP_FILE="wh3r3_15_4z1z.zip"

# Create the directory structure for the flag file
mkdir -p "$(dirname "$FLAG_FILE")"

# Create the file with the flag
echo "$FLAG" > "$FLAG_FILE"

# Encrypt the file with ansible-vault
ansible-vault encrypt "$FLAG_FILE" --vault-password-file <(echo "$VAULT_PASSWORD")

# Zip the directory structure
zip -r "$ZIP_FILE" "./D4554ULT"

# Optional cleanup
# rm -rf "./D4554ULT"

# Output only the path of the created zip file
echo "$ZIP_FILE"
