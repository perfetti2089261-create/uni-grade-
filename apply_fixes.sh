#!/usr/bin/env bash
set -e
if [ -z "$1" ]; then
  echo "Usage: $0 fixes_bundle.txt"
  exit 1
fi
infile="$1"
writing=0
out=""
while IFS= read -r line || [ -n "$line" ]; do
  if [[ "$line" == ===FILE:* ]]; then
    out="${line#===FILE: }"
    mkdir -p "$(dirname "$out")"
    : > "$out"
    writing=1
    continue
  fi
  if [[ "$line" == ===END ]]; then
    writing=0
    out=""
    continue
  fi
  if [[ $writing -eq 1 ]]; then
    printf "%s\n" "$line" >> "$out"
  fi
done < "$infile"

echo "Files written from $infile"

echo "Run: git add . && git commit -m 'apply fixes bundle' && git push origin main" to push changes."
