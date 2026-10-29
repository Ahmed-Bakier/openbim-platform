#!/usr/bin/env bash
# Repository hygiene checks. Safe to run any time; makes no changes.
#  - required files and directories exist
#  - no .env or obvious secret files are tracked by Git
#  - no BIM model / BCF files tracked outside tests/fixtures/
#  - .gitignore actually ignores .env and model files
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || dirname "$0"/..)"

fail=0
ok()   { printf '  \033[32mOK\033[0m   %s\n' "$1"; }
bad()  { printf '  \033[31mFAIL\033[0m %s\n' "$1"; fail=1; }

echo "Required files and directories"
for path in README.md CONTRIBUTING.md .gitignore .editorconfig .env.example Makefile \
            apps workers packages tests docs docs/decisions docs/PROJECT_STATUS.md docs/ROADMAP.md; do
  if [ -e "$path" ]; then ok "$path"; else bad "missing: $path"; fi
done

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  bad "not a Git repository — run: git init -b main"
  exit 1
fi

echo "Secrets are not tracked"
tracked_secrets=$(git ls-files | grep -E '(^|/)\.env($|\.)|\.pem$|\.key$|\.p12$|\.pfx$|(^|/)credentials.*\.json$' \
                  | grep -v -E '(^|/)\.env\.example$' || true)
if [ -z "$tracked_secrets" ]; then ok "no .env / key files tracked"; else bad "tracked secret-like files: $tracked_secrets"; fi

echo "BIM data is not tracked outside tests/fixtures/"
tracked_models=$(git ls-files | grep -iE '\.(ifc|ifczip|ifcxml|bcf|bcfzip|rvt|rfa|nwd|nwc|nwf)$' \
                 | grep -v '^tests/fixtures/' || true)
if [ -z "$tracked_models" ]; then ok "no model/BCF files tracked outside fixtures"; else bad "tracked model files: $tracked_models"; fi

echo ".gitignore rules are effective"
for probe in .env .env.local apps/api/.env uploads/model.ifc some/dir/model.rvt; do
  if git check-ignore -q --no-index "$probe"; then ok "ignored: $probe"; else bad "NOT ignored: $probe"; fi
done
for probe in .env.example tests/fixtures/ifc/sample.ifc tests/fixtures/bcf/sample.bcfzip; do
  if git check-ignore -q --no-index "$probe"; then bad "wrongly ignored: $probe"; else ok "allowed: $probe"; fi
done

echo
if [ "$fail" -eq 0 ]; then echo "All repository checks passed."; else echo "Repository checks FAILED."; fi
exit "$fail"
