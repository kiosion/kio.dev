#!/bin/sh

MODE="prod"
optstring=":m:"

while getopts ${optstring} arg; do
  case ${arg} in
    m)
      # check for valid mode after -m
      if [ "$OPTARG" = "dev" ] || [ "$OPTARG" = "prod" ]; then
        MODE=$OPTARG
      else
        echo "ERR: Invalid mode: $OPTARG"
        exit 1
      fi
      ;;
    :)
      echo "ERR: Must supply an argument to -$OPTARG."
      exit 1
      ;;
    ?)
      echo "ERR: Invalid option: -${OPTARG}."
      exit 2
      ;;
  esac
done

printf "Starting in $MODE mode...\r"

# Check if CWD path 'scripts' directory, if so, change to parent directory
if [ "${PWD##*/}" = "scripts" ]; then
  cd ..
fi

sleep 1

# Install deps / install, hide output
printf "Checking dependencies...\r"
mix deps.get > /dev/null
sleep 1

# Start server w/ mix
printf "\r"
source ./.env
MIX_ENV=$MODE mix run --no-halt
