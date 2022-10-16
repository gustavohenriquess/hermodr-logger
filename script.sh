#!/bin/bash
echo " "
echo " "
echo "⚙️  Compiling hermodr-module"
cd hermodr-module
yarn build
cd ..

echo " "
echo " "
echo "🚀 installing hermodr-ts"
cd hermodr-ts
yarn add ../hermodr-module

echo " "
echo " "
echo "⚙️  Compiling hermodr-ts"
yarn build

echo " "
echo " "

echo "🏁 running hermodr-ts"
yarn start
echo " "
echo " "