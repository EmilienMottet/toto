#!/bin/bash

# Retrieve the flag from the first script argument
FLAG=$1

# Check if the flag has been provided
if [ -z "$FLAG" ]; then
    echo "Error: No flag provided."
    exit 1
fi

# Create a temporary directory for the Java source code and compiled class
TEMP_DIR=$(mktemp -d "java_build.XXXXXX")

# Define the Java file path in the temporary directory
JAVA_FILE="$TEMP_DIR/HelloWorld.java"

# Create the Java file with the class content
cat <<EOF > "$JAVA_FILE"
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Hello, World!");
        discoverFlag();
    }

    private static void discoverFlag() {
        String flag = "$FLAG";
        System.out.println("The flag is almost discovered!");
    }
}
EOF

# Compile the Java file in the temporary directory
(cd "$TEMP_DIR" && javac HelloWorld.java)

# Encode the .class file to base64 and output to standard output
base64 "$TEMP_DIR/HelloWorld.class"

# Clean up: Remove the temporary directory
rm -r "$TEMP_DIR"
