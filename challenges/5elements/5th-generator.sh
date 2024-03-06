#!/bin/bash

# Check if the flag was passed as an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <flag>"
    exit 1
fi

FLAG=$1
VAULT_PASSWORD="leeloo" # Password for ansible-vault

# Get the directory of the current script
SCRIPT_DIR=$(dirname "$BASH_SOURCE")
FLAG_FILE="$SCRIPT_DIR/static/D4554ULT/gct/5/master/SearchFlag.txt"
ZIP_FILE="$SCRIPT_DIR/static/wh3r3_15_4z1z.zip"

# Create the file with the flag
echo "$FLAG" > "$FLAG_FILE"

# Encrypt the file with ansible-vault
ansible-vault encrypt "$FLAG_FILE" --vault-password-file <(echo "$VAULT_PASSWORD")

# Zip the directory structure
rm -f "$ZIP_FILE"
zip -9 -r "$ZIP_FILE" "$SCRIPT_DIR/static/D4554ULT"

# Output only the path of the created zip file
echo "$ZIP_FILE"
