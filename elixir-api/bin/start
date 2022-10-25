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

printf "Installing Hex & rebar3...\r"
mix local.hex --force > /dev/null 2>&1
mix local.rebar --force > /dev/null 2>&1

# Install deps / install, hide output
printf "Building dependencies...\r"
mix deps.get > /dev/null 2>&1

# Sleep for 1 second to fix some weird behavior I can't be arsed to debug rn
sleep 1

# Start server w/ mix
printf "\r"
source ./.env
MIX_ENV=$MODE mix run --no-halt
