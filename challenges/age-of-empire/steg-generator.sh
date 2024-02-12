#!/bin/bash

# Check if the flag was passed as an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <flag>"
    exit 1
fi

FLAG=$1
PASSPHRASE="trololo"
IMAGE_PATH="static/not-encoded-AG3_0F_3MP1R3_II.jpeg"
FLAG_FILE="flag.txt"
OUTPUT_IMAGE="static/AG3_0F_3MP1R3_II.jpeg"

# Create a temporary file containing the flag
echo "$FLAG" > "$FLAG_FILE"

# Use steghide to embed the flag into the image
steghide embed -ef "$FLAG_FILE" -cf "$IMAGE_PATH" -p "$PASSPHRASE" -sf "$OUTPUT_IMAGE"

# Cleanup: Remove the temporary flag file
rm "$FLAG_FILE"

# Output the path of the encoded image
echo "Flag hidden in '$OUTPUT_IMAGE' successfully."

# Echo the path to the encoded image
echo "$(pwd)/$OUTPUT_IMAGE"
