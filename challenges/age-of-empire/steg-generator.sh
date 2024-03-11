#!/bin/bash

# Check if the flag was passed as an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <flag>"
    exit 1
fi

FLAG=$1
PASSPHRASE="trololo"
SCRIPT_DIR=$(dirname "$BASH_SOURCE")
IMAGE_PATH="$SCRIPT_DIR/static/not-encoded-AG3_0F_3MP1R3_II.jpeg"
FLAG_FILE="$SCRIPT_DIR/flag.txt"
OUTPUT_IMAGE="$SCRIPT_DIR/static/AG3_0F_3MP1R3_II.jpeg"

# Create a temporary file containing the flag
echo "https://fr.wikipedia.org/wiki/Sept_collines_de_Rome" > "$FLAG_FILE"
echo "$FLAG" | tr 'A-Za-z' 'H-ZA-Gh-za-g' >> "$FLAG_FILE"


# Use steghide to embed the flag into the image
rm -f "$OUTPUT_IMAGE"
steghide embed -ef "$FLAG_FILE" -cf "$IMAGE_PATH" -p "$PASSPHRASE" -sf "$OUTPUT_IMAGE"

# Write metadata description
exiftool -overwrite_original -ImageDescription="passphrase:${PASSPHRASE}" "$OUTPUT_IMAGE"

# Cleanup: Remove the temporary flag file
rm "$FLAG_FILE"

# Output the path of the encoded image
echo "Flag hidden in '$OUTPUT_IMAGE' successfully."

# Echo the path to the encoded image
echo "$(pwd)/$OUTPUT_IMAGE"
