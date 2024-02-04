# Removes keys stored in git.

# Usage: 
# $ APIKEY=asdf\-asdf ./remove-key-from-git.sh
# [!] Be sure to escape dashes in the APIKEY variable.

# Check input
if [[ -z "$APIKEY" ]]; then
  echo "Missing APIKEY variable"
  exit 1
fi

# Generates a list of any filename that ever existed in git to check. 
# For performance reasons (eg skip node_modules and other files in gitignore)
export RKFG_FILES=$(git reflog --pretty=format:"%H" | sort | uniq | xargs -I % sh -c 'git ls-tree --full-tree --name-only -r %' | sort | uniq)

# Goes into all commits and executes the replace command on all possible filenames.
# Uses `grep -s -I -q .` to silently check if a file is binary and exists in the working tree.
# Uses perl to replace all the instances of $APIKEY is the found non-binary files.
echo "Replacing key: $APIKEY" && git filter-branch --tree-filter 'for item in ${RKFG_FILES} ; do grep -s -I -q . $item && echo $item && perl -pi -e "s/$APIKEY/apikey/g" $item || true; done'