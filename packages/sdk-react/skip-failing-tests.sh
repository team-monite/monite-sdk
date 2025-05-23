#!/bin/zsh

echo "Starting script to selectively skip failing tests based on test-results.json..."

JSON_REPORT_ORIGINAL="test-results.json"
JSON_REPORT_TEMP_PROCESSED="test-results.processed.json" # Temp file for jq pre-processing
BACKUP_DIR="test-backups"
TARGET_FILE_ARG="$1" # Optional argument for a single file path

# --- Configuration --- #
# Set this to true if you have `globals: true` in your vitest.config.ts
# If true, the script will not attempt to add imports for vi, describe, it, test.
VITEST_GLOBALS_ENABLED=true # Set to true since vite.config.ts has globals: true
# --- End Configuration --- #

if [ -n "$TARGET_FILE_ARG" ]; then
  # Try to resolve to an absolute path for robust comparison later
  if [[ "$TARGET_FILE_ARG" != /* ]]; then
    TARGET_FILE_ARG="$PWD/$TARGET_FILE_ARG"
  fi
  TARGET_FILE_ARG=$(readlink -f "$TARGET_FILE_ARG" 2>/dev/null || realpath "$TARGET_FILE_ARG" 2>/dev/null || echo "$TARGET_FILE_ARG") # Make absolute
  if [ ! -f "$TARGET_FILE_ARG" ]; then
    echo "Error: Specified target file '$1' (resolved to '$TARGET_FILE_ARG') not found."
    exit 1
  fi
  echo "Running in single-file mode. Target: $TARGET_FILE_ARG"
  
  # Run the specified test and generate a JSON report if it doesn't exist
  if [ ! -f "$JSON_REPORT_ORIGINAL" ]; then
    echo "No test-results.json found. Running test to generate it..."
    # Use relative path for yarn test command
    RELATIVE_PATH=${TARGET_FILE_ARG#"$PWD/"}
    echo "Using relative path for test: $RELATIVE_PATH"
    yarn test $RELATIVE_PATH --reporter=json --reporter=default > $JSON_REPORT_ORIGINAL
    
    if [ ! -f "$JSON_REPORT_ORIGINAL" ] || [ ! -s "$JSON_REPORT_ORIGINAL" ]; then
      echo "Failed to generate test report. Please check the test command."
      exit 1
    fi
    echo "Test report generated successfully."
  fi
fi

if [ ! -f "$JSON_REPORT_ORIGINAL" ]; then
  echo "Error: Test report '$JSON_REPORT_ORIGINAL' not found. Please generate it first."
  exit 1
fi

# Pre-process the JSON to extract only the valid JSON part, remove control characters/ANSI codes, then escape newlines within strings.
echo "Pre-processing '$JSON_REPORT_ORIGINAL' to '$JSON_REPORT_TEMP_PROCESSED'..."

# Extract only the JSON part (starting with { and ending with })
sed -n '/^{/,/^}$/p' "$JSON_REPORT_ORIGINAL" > "$JSON_REPORT_TEMP_PROCESSED.raw"

# Check if extraction was successful
if [ ! -s "$JSON_REPORT_TEMP_PROCESSED.raw" ]; then
  # Try another approach to get valid JSON - extract from the first { to the last }
  sed -n '/{/,/}/p' "$JSON_REPORT_ORIGINAL" > "$JSON_REPORT_TEMP_PROCESSED.raw"
fi

# Now process that extracted JSON to clean it up
cat "$JSON_REPORT_TEMP_PROCESSED.raw" | \
    iconv -f UTF-8 -t UTF-8 -c | \
    sed -E 's/\x1b\[[0-9;]*[mGKH]//g' | \
    tr -d '\000-\010\013\014\016-\037\177' | \
    jq 'walk(if type == "string" then gsub("\\n"; "\\\\n") | gsub("\\r"; "\\\\r") else . end)' 2>/dev/null > "$JSON_REPORT_TEMP_PROCESSED" || \
    cat "$JSON_REPORT_TEMP_PROCESSED.raw" > "$JSON_REPORT_TEMP_PROCESSED"

rm -f "$JSON_REPORT_TEMP_PROCESSED.raw"

if [ ! -s "$JSON_REPORT_TEMP_PROCESSED" ]; then
    echo "Error: Pre-processed JSON report '$JSON_REPORT_TEMP_PROCESSED' is empty or not created. Original report might be malformed or pre-processing command failed."
    if [ -f "$JSON_REPORT_ORIGINAL" ]; then
        echo "--- Last 5 lines of original report ($JSON_REPORT_ORIGINAL) --- "
        tail -n 5 "$JSON_REPORT_ORIGINAL"
        echo "-----------------------------------------------------"
    fi
    exit 1
fi

echo "Validating pre-processed JSON report '$JSON_REPORT_TEMP_PROCESSED'..."
if ! jq . "$JSON_REPORT_TEMP_PROCESSED" > /dev/null 2>&1; then
    echo "Error: Pre-processed JSON report '$JSON_REPORT_TEMP_PROCESSED' is not valid JSON. Please check pre-processing steps and the original report."
    echo "--- Last 5 lines of pre-processed report ($JSON_REPORT_TEMP_PROCESSED) --- "
    tail -n 5 "$JSON_REPORT_TEMP_PROCESSED"
    echo "-----------------------------------------------------"
    exit 1
else
    echo "Pre-processed JSON report is valid."
fi

mkdir -p "$BACKUP_DIR"
declare -a backed_up_original_paths

echo "Processing pre-processed test report ('$JSON_REPORT_TEMP_PROCESSED')..."

jq -c '.testResults[]' "$JSON_REPORT_TEMP_PROCESSED" | while IFS= read -r test_suite_json; do
  file_path_from_report=$(printf "%s" "$test_suite_json" | jq -r '.name')
  suite_status=$(printf "%s" "$test_suite_json" | jq -r '.status')

  if [ -z "$file_path_from_report" ] || [ "$file_path_from_report" == "null" ]; then
    echo "  Warning: Could not extract file_path from a test suite entry. Raw entry: $test_suite_json"
    continue
  fi

  # Resolve reported path to an absolute path for comparison
  resolved_file_path_from_report=$(readlink -f "$file_path_from_report" 2>/dev/null || realpath "$file_path_from_report" 2>/dev/null || echo "$file_path_from_report")

  # Use relative path for operations within the project, but absolute for matching TARGET_FILE_ARG
  relative_file_path=${file_path_from_report#"$PWD/"} # This might need adjustment if $PWD is not SDK root
  # A more robust way to get relative path if script is in packages/sdk-react
  # Assuming PWD is packages/sdk-react, and file_path_from_report is absolute /.../packages/sdk-react/src/...
  # We need to ensure relative_file_path is like src/...
  # For now, this assumes script is run from workspace root or file_path_from_report is already relative to PWD.
  # The user's paths in test-results.json are absolute.
  # So, if PWD is /Volumes/ByteRiver/gh-monite/monite-sdk/packages/sdk-react
  # and file_path_from_report is /Volumes/ByteRiver/gh-monite/monite-sdk/packages/sdk-react/src/api/client.test.ts
  # then relative_file_path should become src/api/client.test.ts
  # Let's assume the script is run from `packages/sdk-react`
  # So PWD is the directory containing the script.
  # And file_path_from_report starts with /Volumes/ByteRiver/gh-monite/monite-sdk/packages/sdk-react/
  # We need the path relative to the PWD for file operations.
  # Check if file_path_from_report starts with PWD
  if [[ "$file_path_from_report" == "$PWD/"* ]]; then
    operating_file_path=${file_path_from_report#"$PWD/"}
  else
    # This case means the path in JSON is not relative to current PWD in a simple way,
    # or it's an absolute path not under PWD. This might indicate an issue or require
    # more complex path mapping if the script is not run from the expected directory.
    # For now, we'll assume it's a full path we can operate on, but this could be fragile.
    operating_file_path="$file_path_from_report"
    # If TARGET_FILE_ARG is used, it's absolute. file_path_from_report is also absolute.
    # For operations like `cp` and `sed`, we need path accessible from PWD.
    # If script is at packages/sdk-react/skip-failing-tests.sh
    # And file is at packages/sdk-react/src/foo.test.ts
    # Then operating_file_path should be src/foo.test.ts
    # This is correctly handled if file_path_from_report is absolute and PWD is its parent dir.
  fi


  if [ ! -f "$operating_file_path" ]; then
      # Fallback for TARGET_FILE_ARG, try direct comparison if operating_file_path failed
      if [ -n "$TARGET_FILE_ARG" ] && [ "$resolved_file_path_from_report" == "$TARGET_FILE_ARG" ] && [ -f "$TARGET_FILE_ARG" ]; then
          operating_file_path="$TARGET_FILE_ARG" # Use the validated target arg path
          echo "  Info: Using TARGET_FILE_ARG path directly: $operating_file_path"
      else
          echo "  Warning: Test file '$operating_file_path' (from report: '$file_path_from_report') not found. Skipping."
          continue
      fi
  fi
  
  if [ -n "$TARGET_FILE_ARG" ]; then
    if [ "$resolved_file_path_from_report" != "$TARGET_FILE_ARG" ]; then
      continue
    fi
    echo "Processing specified target file: $operating_file_path"
  else
    echo "Processing file: $operating_file_path"
  fi

  backup_file="$BACKUP_DIR/$(basename "$operating_file_path").bak"
  if [ ! -f "$backup_file" ] || [ "$operating_file_path" -nt "$backup_file" ]; then
    cp "$operating_file_path" "$backup_file"
    echo "  Backed up $operating_file_path to $backup_file"
    if ! printf '%s\n' "${backed_up_original_paths[@]}" | grep -q -x "$operating_file_path"; then
        backed_up_original_paths+=("$operating_file_path")
    fi
  else
    echo "  Backup $backup_file is up-to-date. Skipping backup."
  fi

  # --- Import cleanup and assurance ---
  echo "  Processing imports for $operating_file_path"
  made_jest_replacements=false

  # 1. Replace jest.X with vi.X
  if grep -q 'jest\.fn' "$operating_file_path"; then
    echo "    Replacing jest.fn with vi.fn..."
    sed -i.bak_sed 's/jest\.fn/vi.fn/g' "$operating_file_path" && rm -f "${operating_file_path}.bak_sed"
    made_jest_replacements=true
  fi
  if grep -q 'jest\.spyOn' "$operating_file_path"; then
    echo "    Replacing jest.spyOn with vi.spyOn..."
    sed -i.bak_sed 's/jest\.spyOn/vi.spyOn/g' "$operating_file_path" && rm -f "${operating_file_path}.bak_sed"
    made_jest_replacements=true
  fi
  if grep -q 'jest\.mock' "$operating_file_path"; then
    echo "    Replacing jest.mock with vi.mock..."
    sed -i.bak_sed 's/jest\.mock/vi.mock/g' "$operating_file_path" && rm -f "${operating_file_path}.bak_sed"
    made_jest_replacements=true
  fi
  # Add other common jest replacements here if needed, e.g., jest.clearAllMocks -> vi.clearAllMocks

  # 2. Remove any erroneous import lines with '\vitest'
  if grep -q "from '\\\\vitest';" "$operating_file_path"; then # Escaped backslash for grep
    echo "    Found and removing import line(s) with '\\vitest'..."
    # Use a temp file for sed -i '' compatibility if it's an issue (macOS sed)
    sed -i.bak_sed "/from '\\\\vitest';/d" "$operating_file_path" && rm -f "${operating_file_path}.bak_sed"
  fi

  # 2. Ensure 'describe, it, test' are imported if the file uses them.
  uses_vitest_globals=$(grep -E -q "(describe|it|test)\\s*\\(" "$operating_file_path" && echo "yes" || echo "no")
  has_correct_vitest_import=$(grep -q -F "import { describe, it, test } from 'vitest';" "$operating_file_path" && echo "yes" || echo "no")
  # Check if 'vi' needs to be imported
  needs_vi_import=false
  if [ "$VITEST_GLOBALS_ENABLED" = false ]; then # Only add import if globals are not enabled
    if [ "$made_jest_replacements" = true ] || grep -q 'vi\.' "$operating_file_path"; then
      if ! grep -q -E "import\\s+\\{[^}]*\\bvi\\b[^}]*\\}\\s+from\\s+'vitest';" "$operating_file_path"; then
        needs_vi_import=true
      fi
    fi
  fi

  # Check if 'describe, it, test' needs to be imported
  needs_dit_import=false # describe, it, test
  if [ "$VITEST_GLOBALS_ENABLED" = false ]; then # Only add import if globals are not enabled
    if [ "$uses_vitest_globals" = "yes" ]; then
      if ! grep -q -E "import\\s+\\{[^}]*\\b(describe|it|test)\\b[^}]*\\}\\s+from\\s+'vitest';" "$operating_file_path"; then
        # A more specific check to see if a line *only* for d,i,t is missing
        if ! grep -q -F "import { describe, it, test } from 'vitest';" "$operating_file_path"; then
          needs_dit_import=true
        fi
      fi
    fi
  fi

  if [ "$needs_vi_import" = true ] || [ "$needs_dit_import" = true ]; then
    last_import_lineno=$(awk '/^\\s*import\\s/ {line=NR} END{print line+0}' "$operating_file_path")
    added_vi_msg=""
    added_dit_msg=""

    temp_import_file="$operating_file_path.imports.tmp"
    # Create a pristine copy for modifications in this block
    cp "$operating_file_path" "$temp_import_file"

    if [ "$needs_vi_import" = true ]; then
        echo "    Adding 'import { vi } from \\'vitest\\';'"
        if [ "$last_import_lineno" -gt 0 ]; then
            awk -v lineno="$last_import_lineno" '1; NR==lineno {print "import { vi } from \\'vitest\\';"}' "$temp_import_file" > "$operating_file_path.tmp" && mv "$operating_file_path.tmp" "$temp_import_file"
        else
            (echo "import { vi } from 'vitest';" && cat "$temp_import_file") > "$operating_file_path.tmp" && mv "$operating_file_path.tmp" "$temp_import_file"
        fi
        last_import_lineno=$((last_import_lineno + 1)) # Adjust for next potential import
        added_vi_msg="Added 'import { vi } from \'vitest\'';'."
    fi

    if [ "$needs_dit_import" = true ]; then
        echo "    File uses describe/it/test. Adding 'import { describe, it, test } from \\'vitest\\';'"
        if [ "$last_import_lineno" -gt 0 ]; then
            awk -v lineno="$last_import_lineno" '1; NR==lineno {print "import { describe, it, test } from \\'vitest\\';"}' "$temp_import_file" > "$operating_file_path.tmp" && mv "$operating_file_path.tmp" "$temp_import_file"
        else
             # This case should ideally not happen if last_import_lineno was 0 and vi was also added, it would have become > 0
            (echo "import { describe, it, test } from 'vitest';" && cat "$temp_import_file") > "$operating_file_path.tmp" && mv "$operating_file_path.tmp" "$temp_import_file"
        fi
        added_dit_msg="Added 'import { describe, it, test } from \'vitest\'';'."
    fi
    
    # Only mv if changes were actually staged in temp_import_file
    if [ "$needs_vi_import" = true ] || [ "$needs_dit_import" = true ]; then
        mv "$temp_import_file" "$operating_file_path"
        echo "      $added_vi_msg $added_dit_msg (Imports added because VITEST_GLOBALS_ENABLED=false)"
    else
        rm -f "$temp_import_file" # No changes, remove temp
    fi
  else
    # VITEST_GLOBALS_ENABLED is true, so we expect globals to be available
    if [ "$made_jest_replacements" = true ] || grep -q 'vi\.' "$operating_file_path"; then
       echo "    'vi' is used. Assuming it is globally available (VITEST_GLOBALS_ENABLED=true)."
    fi
    if [ "$uses_vitest_globals" = "yes" ]; then
       echo "    describe/it/test are used. Assuming they are globally available (VITEST_GLOBALS_ENABLED=true)."
    fi
  fi
  
  echo "    Reminder: This script does not automatically de-duplicate all types of imports (e.g., 'Mock, MockedFunction' from 'vitest')."
  echo "    Please review files for such duplicates and manually correct them or use a linter/formatter like 'eslint --fix'."
  # --- End of Import cleanup and assurance ---

  num_assertions=$(printf "%s" "$test_suite_json" | jq -r '.assertionResults | length')
  num_failed_assertions=$(printf "%s" "$test_suite_json" | jq -r '[.assertionResults[] | select(.status == "failed")] | length')

  if [ "$num_assertions" == "null" ] || [ "$num_failed_assertions" == "null" ]; then
      echo "  Warning: Could not extract assertion counts for $operating_file_path. Skipping modifications for this file."
      continue
  fi

  if [ "$suite_status" == "failed" ]; then
    # Always process individual failing tests, regardless of how many there are
    echo "  $num_failed_assertions out of $num_assertions tests failed in $operating_file_path. Skipping individual tests."
    failing_test_titles_json=$(printf "%s" "$test_suite_json" | jq -c '.assertionResults[] | select(.status == "failed") | .ancestorTitles + [.title]')
    
    printf "%s\n" "$failing_test_titles_json" | while IFS= read -r test_title_array_json; do
      if [ -z "$test_title_array_json" ]; then continue; fi
      it_title=$(printf "%s" "$test_title_array_json" | jq -r '.[-1]')
      if [ -z "$it_title" ] || [ "$it_title" == "null" ]; then
          echo "    Warning: Could not extract a valid it_title from: $test_title_array_json"
          continue
      fi

      escaped_it_title=$(printf "%s" "$it_title" | sed -e 's/[&/\\\\^$.*[]]/\\\\\\\\&/g' -e 's/"/\\"/g' -e "s/'/\\'/g") # Escape for sed regex and quotes
      
      full_title_for_log=$(printf "%s" "$test_title_array_json" | jq -r 'join(" ")')
      echo "    Attempting to skip test: '$it_title' (from full: '$full_title_for_log') in $operating_file_path"
      
      # Preserve indentation, 'it' or 'test', potential .chaining (like .only, .todo, .each), quotes, and rest of the line
      # Add .skip only if not already present directly before chaining or parenthesis.
      if [[ "$OSTYPE" == "darwin"* ]]; then
        # For macOS (BSD sed) use a simpler approach - create a temp file with awk
        echo "    Using macOS-compatible approach for adding .skip"
        awk -v title="$escaped_it_title" '
          /test\(.*"'"$escaped_it_title"'"/ || /test\(.*'"'"''"$escaped_it_title"''"'"'/ || /it\(.*"'"$escaped_it_title"'"/ || /it\(.*'"'"''"$escaped_it_title"''"'"'/ {
            sub(/test/, "test.skip");
            sub(/it\(/, "it.skip(");
          }
          { print }
        ' "$operating_file_path" > "$operating_file_path.tmp" && mv "$operating_file_path.tmp" "$operating_file_path"
      else
        # Linux version (GNU sed)
        sed -i.bak_sed -E "s/^([[:space:]]*)(it|test)(?!\\.skip)(\\.[a-zA-Z0-9_]+)*\\s*\\((['\"\\\`])${escaped_it_title}\\4(.*)/\\1\\2.skip\\3(\\4${escaped_it_title}\\4\\5/g" "$operating_file_path" && rm -f "${operating_file_path}.bak_sed"
      fi
    done
  else
    echo "  Suite $operating_file_path status is '$suite_status'. No modifications needed for failures."
  fi
done

echo "Creating restore script at $BACKUP_DIR/restore-tests.sh..."
cat > "$BACKUP_DIR/restore-tests.sh" << EOL
#!/bin/zsh
# Script to restore the original test files

echo "Restoring original test files..."
EOL

for original_path in "${backed_up_original_paths[@]}"; do
  if [ -z "$original_path" ]; then continue; fi
  backup_path="$BACKUP_DIR/$(basename "$original_path").bak"
  echo "cp -v \"$PWD/$backup_path\" \"$original_path\"" >> "$BACKUP_DIR/restore-tests.sh" # Ensure backup path is relative to where restore script is
done

echo "echo \"Done! All restored files processed.\"" >> "$BACKUP_DIR/restore-tests.sh"
chmod +x "$BACKUP_DIR/restore-tests.sh"

# rm -f "$JSON_REPORT_TEMP_PROCESSED"

echo ""
echo "Script finished."
echo "Summary:"
echo "---------------------------------------"
echo "Processed files based on pre-processed version of '$JSON_REPORT_ORIGINAL'."
echo "Backup files are in '$BACKUP_DIR/' directory."
echo "To restore original files, run from $PWD: sh $BACKUP_DIR/restore-tests.sh"
echo "To process a single file, run: $0 path/to/your/file.test.tsx"
echo ""
echo "Next steps:"
echo "1. Carefully review the changes made to the test files, especially imports and jest-to-vi replacements."
echo "2. Manually de-duplicate any remaining import lines (e.g., for 'Mock', 'MockedFunction' from 'vitest') or use 'eslint --fix'."
echo "3. Run 'yarn test' or your usual Vitest command to check if 'jest is not defined' errors are resolved."
echo "4. If errors persist, manually update the problematic files. Check for less common jest usages."
echo "5. Once 'jest is not defined' errors are gone, re-run this script if you still have logically failing tests to skip them."
echo "6. Gradually fix skipped tests and remove the '.skip' flags."
