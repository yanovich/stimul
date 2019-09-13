#!/bin/sh

git ls-tree --name-only -r HEAD | grep js$ | xargs prettier --write
node node_modules/.bin/standard --fix
