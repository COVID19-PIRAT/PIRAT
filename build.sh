#!/bin/bash

set -e

ng build --configuration=production --localize

# Germany
mkdir dist/de
cp -r dist/pirat/de dist/de
sed -i 's/<base href="/<base href="\/de/' dist/de/de/index.html
cp -r dist/pirat/en dist/de
sed -i 's/<base href="/<base href="\/de/' dist/de/en/index.html

# Austria
mkdir dist/at
cp -r dist/pirat/de dist/at
sed -i 's/<base href="/<base href="\/at/' dist/at/de/index.html
cp -r dist/pirat/en dist/at
sed -i 's/<base href="/<base href="\/at/' dist/at/en/index.html

# Italy
mkdir dist/it
cp -r dist/pirat/it dist/it
sed -i 's/<base href="/<base href="\/it/' dist/it/it/index.html
cp -r dist/pirat/en dist/it
sed -i 's/<base href="/<base href="\/it/' dist/it/en/index.html

# Malaysia
mkdir dist/my
cp -r dist/pirat/en dist/my
sed -i 's/<base href="/<base href="\/my/' dist/my/en/index.html


rm -r dist/pirat
