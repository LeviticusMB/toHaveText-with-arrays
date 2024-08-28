set -e

for node in 16 18 20 22; do
    export PATH=/opt/homebrew/opt/node@$node/bin:/opt/homebrew/bin:/bin:/usr/bin;

    for cmd in "npm i" "yarn install --ignore-engines" "pnpm i"; do
        for type in commonjs module; do
            rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml
            sed -i '' -e "s/\"type\":.*/\"type\": \"$type\",/" package.json

            node --version
            grep '"type"' package.json
            sh -xc "$cmd"

            node_modules/.bin/playwright test;
        done
    done
done
