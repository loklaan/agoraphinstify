#!/bin/bash
# Outputs all lcov reports to console

while read line
do
  cat $line
done < <(find ./ -maxdepth 4 -name lcov.info) | cat