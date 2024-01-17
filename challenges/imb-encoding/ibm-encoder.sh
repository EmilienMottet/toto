#!/usr/bin/env bash

echo $1 | iconv -f ISO8859-1 -t IBM-1047 | base64
