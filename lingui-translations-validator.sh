#!/bin/bash
set -o errexit

# Setup locale file list to check for uncommitted changes
##################################
locale_files=$(find "packages/sdk-react/src/core/i18n/locales" -maxdepth 2 -name 'messages.po')
locale_files+=" $(find "packages/sdk-demo/src/locales" -maxdepth 2 -name 'messages.po')"
##################################

# Create a temporary file to store the mapping between the original and temp files
temp_file_mapping=$(mktemp)

# Store original file content to temp files
for file in $locale_files; do
    temp_file=$(mktemp)
    echo "$(cat "$file")" > "$temp_file"
    echo "$file $temp_file" >> "$temp_file_mapping"
done

yarn turbo run extract-translations >> /dev/null

filter_utility_lines() {
    grep -v "^#" | grep -v "^$" | grep -v "POT-Creation-Date"
}

red_on="\033[31m"
red_off="\033[0m"

# Check for differences and output error messages
declare -i errors_found=0
while read -r file temp_file; do
    NEW_MESSAGES="$(cat "$file" | filter_utility_lines)"
    PREV_MESSAGES="$(cat "$temp_file" | filter_utility_lines)"
    DIFF="$(diff -y --suppress-common-lines <(echo "$NEW_MESSAGES") <(echo "$PREV_MESSAGES"))" || true

    if [[ ! -z "$DIFF" ]]; then
        echo -e "$red_on\xE2\x9A\xA0 Error: $file has uncommitted translation changes.$red_off"
        echo "To fix this, run 'yarn turbo run extract-translations' and commit the changes."
        echo "$DIFF"
        echo "----------------------------------------------"
        echo ""
        errors_found+=1
    fi
done < "$temp_file_mapping"

# Clean up temporary files
while read -r file temp_file; do
    rm "$temp_file"
done < "$temp_file_mapping"
rm "$temp_file_mapping"

# If any errors were found, exit with error code 1
if (( errors_found > 0 )); then
    echo -e "$red_on\xE2\x9A\xA0 Total errors found: $errors_found. Please run 'yarn turbo run extract-translations' and commit the changes.$red_off"
    exit 1
else
    echo -e "\xE2\x9C\x85 Everything looks good. No uncommitted changes in translation files."
fi
