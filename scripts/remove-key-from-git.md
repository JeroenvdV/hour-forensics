# Safely Removing Sensitive Keys from Your Git History

In the world of software development, safeguarding sensitive information, such as API keys, is paramount. However, there might come a time when, either by oversight or accident, sensitive keys are committed to a Git repository. When this happens, simply removing the keys from the current files and committing the changes is not enough; the keys remain in the Git history, accessible to anyone who knows where to look. This blog post will guide you through the process of using a bash script, `remove-key-from-git.sh`, to remove sensitive keys from your Git history safely and thoroughly.

## Introduction to `remove-key-from-git.sh`

The `remove-key-from-git.sh` script is a powerful tool designed to search through your Git repository's entire history for a specific API key and replace it with a placeholder. This ensures that the sensitive key is not just removed from the current state of the repository but also from its entire commit history, effectively protecting your sensitive data from potential misuse.

### Key Features:

- **Thorough Search:** Generates a list of all filenames that have ever existed in the Git repository to ensure no file is missed.
- **Performance Optimized:** Skips files ignored by Git (like `node_modules`), enhancing the script's performance.
- **Binary File Check:** Silently checks if a file is binary to avoid unnecessary or harmful modifications.
- **In-place Replacement:** Uses Perl for in-place replacement of the sensitive key with a placeholder in non-binary files.

### Usage Instructions:

1. **Escape Dashes in API Key:** If your API key contains dashes, ensure you escape them before using the script. This is crucial for the script to accurately identify your API key in the files. It's needed because the key is used within a perl regex.

```bash
APIKEY=asdf\\-asdf ./remove-key-from-git.sh
```

2. **Run the Script:** Execute the script in the root directory of your Git repository. The script will automatically find and replace the instances of your API key in the repository's history.

## Step-by-Step Explanation of the Script

### 1. Check Input

First, the script checks if the `APIKEY` variable is set. If not, it outputs a message indicating that the API key is missing and exits to prevent any unintended operations.

```bash
if [[ -z "$APIKEY" ]]; then
  echo "Missing APIKEY variable"
  exit 1
fi
```

### 2. Generate File List

The script then generates a list of all filenames that have ever existed in the Git history, excluding files ignored by Git for performance reasons. This comprehensive approach ensures that no file containing the sensitive key is overlooked.

```bash
export RKFG_FILES=$(git reflog --pretty=format:"%H" | sort | uniq | xargs -I % sh -c 'git ls-tree --full-tree --name-only -r %' | sort | uniq)
```

### 3. Replace the Key in Files

Lastly, the script iterates over the list of filenames, checking each file to determine if it's a binary file and if it exists in the working tree. If the file is a non-binary and contains the API key, the script uses Perl to replace the key with `apikey`.

```bash
echo "Replacing key: $APIKEY" && git filter-branch --tree-filter 'for item in ${RKFG_FILES} ; do grep -s -I -q . $item && echo $item && perl -pi -e "s/$APIKEY/apikey/g" $item || true; done'
```

### Script Breakdown

#### 1. Checking for the APIKEY variable

```bash
if [[ -z "$APIKEY" ]]; then
  echo "Missing APIKEY variable"
  exit 1
fi
```

- `if [[ -z "$APIKEY" ]]; then`: Checks if the `APIKEY` variable is empty. `-z` tests for a zero-length string.
- `echo "Missing APIKEY variable"`: Prints a message indicating that the `APIKEY` variable is missing.
- `exit 1`: Exits the script with a status of 1, indicating an error.

#### 2. Generating a List of Filenames

```bash
export RKFG_FILES=$(git reflog --pretty=format:"%H" | sort | uniq | xargs -I % sh -c 'git ls-tree --full-tree --name-only -r %' | sort | uniq)
```

- `export RKFG_FILES=$(...)`: Assigns the result of the command inside the `$()` to the `RKFG_FILES` variable and exports it for use in child processes.
- `git reflog --pretty=format:"%H"`: Lists the commit hashes from the reflog in a simple format.
- `sort | uniq`: Sorts the commit hashes and removes any duplicates.
- `xargs -I % sh -c 'git ls-tree --full-tree --name-only -r %'`: For each commit hash, executes a shell command to list all the files in that commit.
  - `git ls-tree --full-tree --name-only -r %`: Lists filenames from the given commit (`%`), including files in subdirectories (`--full-tree`) and only the names (`--name-only`), recursively (`-r`).
- `sort | uniq`: Again, sorts the list of filenames and removes duplicates. We expect many, because we have joined all the lists of filenames from all commits together.

#### 3. Replacing the Key in Files

```bash
echo "Replacing key: $APIKEY" && git filter-branch --tree-filter 'for item in ${RKFG_FILES} ; do grep -s -I -q . $item && echo $item && perl -pi -e "s/$APIKEY/apikey/g" $item || true; done'
```

- `echo "Replacing key: $APIKEY"`: Prints a message indicating the key that will be replaced.
- `git filter-branch --tree-filter '...'`: Rewrites the Git history by applying the specified command (`--tree-filter`) to each commit.
- `for item in ${RKFG_FILES}`: Iterates over each filename stored in `RKFG_FILES`. This variable is available here because we exported it.
- `grep -s -I -q . $item`: Checks if the file is non-binary and exists.
  - `-s`: Suppresses error messages. This ensures there is no message when a file does not exist, because that is expected in many cases.
  - `-I`: Ignores binary files.
  - `-q`: Quiet mode, doesn’t output anything, just returns an exit status.
  - `.`: Matches any character, used here to check the existence of the file.
- `&& echo $item`: If the file is non-binary and exists, prints its name. This is just for logging.
- `perl -pi -e "s/$APIKEY/apikey/g" $item`: Uses Perl to perform an in-place (`-p`) substitution of `$APIKEY` with `apikey` in the file (`$item`), globally (`g`).
- `|| true`: Ensures that the script continues even if the `grep` command fails for a particular file, because it's meant to fail by design.
