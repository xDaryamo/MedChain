#!/usr/bin/env bash

source "$FABLO_NETWORK_ROOT/fabric-docker/scripts/channel-query-functions.sh"

set -eu

channelQuery() {
  echo "-> Channel query: " + "$@"

  if [ "$#" -eq 1 ]; then
    printChannelsHelp

  elif [ "$1" = "list" ] && [ "$2" = "ospedalemaresca" ] && [ "$3" = "peer0" ]; then

    peerChannelList "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041"

  elif

    [ "$1" = "getinfo" ] && [ "$2" = "patient-records-channel" ] && [ "$3" = "ospedalemaresca" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "patient-records-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "patient-records-channel" ] && [ "$4" = "ospedalemaresca" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "patient-records-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "$TARGET_FILE" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$3" = "patient-records-channel" ] && [ "$4" = "ospedalemaresca" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "patient-records-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "${BLOCK_NAME}" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "$TARGET_FILE"

  else

    echo "$@"
    echo "$1, $2, $3, $4, $5, $6, $7, $#"
    printChannelsHelp
  fi

}

printChannelsHelp() {
  echo "Channel management commands:"
  echo ""

  echo "fablo channel list ospedalemaresca peer0"
  echo -e "\t List channels on 'peer0' of 'OspedaleMaresca'".
  echo ""

  echo "fablo channel getinfo patient-records-channel ospedalemaresca peer0"
  echo -e "\t Get channel info on 'peer0' of 'OspedaleMaresca'".
  echo ""
  echo "fablo channel fetch config patient-records-channel ospedalemaresca peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'OspedaleMaresca'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> patient-records-channel ospedalemaresca peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'OspedaleMaresca'".
  echo ""

}
