#!/usr/bin/env bash

source "$FABLO_NETWORK_ROOT/fabric-docker/scripts/channel-query-functions.sh"

set -eu

channelQuery() {
  echo "-> Channel query: " + "$@"

  if [ "$#" -eq 1 ]; then
    printChannelsHelp

  elif [ "$1" = "list" ] && [ "$2" = "example" ] && [ "$3" = "peer0" ]; then

    peerChannelList "cli.example.medchain.com" "peer0.example.medchain.com:7041"

  elif
    [ "$1" = "list" ] && [ "$2" = "ospedalemaresca" ] && [ "$3" = "peer0" ]
  then

    peerChannelList "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061"

  elif
    [ "$1" = "list" ] && [ "$2" = "medicinageneralenapoli" ] && [ "$3" = "peer0" ]
  then

    peerChannelList "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081"

  elif
    [ "$1" = "list" ] && [ "$2" = "farmaciapetrone" ] && [ "$3" = "peer0" ]
  then

    peerChannelList "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101"

  elif
    [ "$1" = "list" ] && [ "$2" = "laboratorioanalisicmo" ] && [ "$3" = "peer0" ]
  then

    peerChannelList "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121"

  elif
    [ "$1" = "list" ] && [ "$2" = "patients" ] && [ "$3" = "peer0" ]
  then

    peerChannelList "cli.patients.medchain.com" "peer0.patients.medchain.com:7141"

  elif

    [ "$1" = "getinfo" ] && [ "$2" = "patient-records-channel" ] && [ "$3" = "example" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "patient-records-channel" "cli.example.medchain.com" "peer0.example.medchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "patient-records-channel" ] && [ "$4" = "example" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "patient-records-channel" "cli.example.medchain.com" "$TARGET_FILE" "peer0.example.medchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$3" = "patient-records-channel" ] && [ "$4" = "example" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "patient-records-channel" "cli.example.medchain.com" "${BLOCK_NAME}" "peer0.example.medchain.com:7041" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "patient-records-channel" ] && [ "$3" = "ospedalemaresca" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "patient-records-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "patient-records-channel" ] && [ "$4" = "ospedalemaresca" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "patient-records-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "$TARGET_FILE" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061"

  elif [ "$1" = "fetch" ] && [ "$3" = "patient-records-channel" ] && [ "$4" = "ospedalemaresca" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "patient-records-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "${BLOCK_NAME}" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "patient-records-channel" ] && [ "$3" = "medicinageneralenapoli" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "patient-records-channel" "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "patient-records-channel" ] && [ "$4" = "medicinageneralenapoli" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "patient-records-channel" "cli.medicina-generale-napoli.medchain.com" "$TARGET_FILE" "peer0.medicina-generale-napoli.medchain.com:7081"

  elif [ "$1" = "fetch" ] && [ "$3" = "patient-records-channel" ] && [ "$4" = "medicinageneralenapoli" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "patient-records-channel" "cli.medicina-generale-napoli.medchain.com" "${BLOCK_NAME}" "peer0.medicina-generale-napoli.medchain.com:7081" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "patient-records-channel" ] && [ "$3" = "patients" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "patient-records-channel" "cli.patients.medchain.com" "peer0.patients.medchain.com:7141"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "patient-records-channel" ] && [ "$4" = "patients" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "patient-records-channel" "cli.patients.medchain.com" "$TARGET_FILE" "peer0.patients.medchain.com:7141"

  elif [ "$1" = "fetch" ] && [ "$3" = "patient-records-channel" ] && [ "$4" = "patients" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "patient-records-channel" "cli.patients.medchain.com" "${BLOCK_NAME}" "peer0.patients.medchain.com:7141" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "prescriptions-channel" ] && [ "$3" = "example" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "prescriptions-channel" "cli.example.medchain.com" "peer0.example.medchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "prescriptions-channel" ] && [ "$4" = "example" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "prescriptions-channel" "cli.example.medchain.com" "$TARGET_FILE" "peer0.example.medchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$3" = "prescriptions-channel" ] && [ "$4" = "example" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "prescriptions-channel" "cli.example.medchain.com" "${BLOCK_NAME}" "peer0.example.medchain.com:7041" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "prescriptions-channel" ] && [ "$3" = "ospedalemaresca" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "prescriptions-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "prescriptions-channel" ] && [ "$4" = "ospedalemaresca" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "prescriptions-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "$TARGET_FILE" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061"

  elif [ "$1" = "fetch" ] && [ "$3" = "prescriptions-channel" ] && [ "$4" = "ospedalemaresca" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "prescriptions-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "${BLOCK_NAME}" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "prescriptions-channel" ] && [ "$3" = "medicinageneralenapoli" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "prescriptions-channel" "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "prescriptions-channel" ] && [ "$4" = "medicinageneralenapoli" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "prescriptions-channel" "cli.medicina-generale-napoli.medchain.com" "$TARGET_FILE" "peer0.medicina-generale-napoli.medchain.com:7081"

  elif [ "$1" = "fetch" ] && [ "$3" = "prescriptions-channel" ] && [ "$4" = "medicinageneralenapoli" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "prescriptions-channel" "cli.medicina-generale-napoli.medchain.com" "${BLOCK_NAME}" "peer0.medicina-generale-napoli.medchain.com:7081" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "prescriptions-channel" ] && [ "$3" = "farmaciapetrone" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "prescriptions-channel" "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "prescriptions-channel" ] && [ "$4" = "farmaciapetrone" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "prescriptions-channel" "cli.farmacia-petrone.medchain.com" "$TARGET_FILE" "peer0.farmacia-petrone.medchain.com:7101"

  elif [ "$1" = "fetch" ] && [ "$3" = "prescriptions-channel" ] && [ "$4" = "farmaciapetrone" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "prescriptions-channel" "cli.farmacia-petrone.medchain.com" "${BLOCK_NAME}" "peer0.farmacia-petrone.medchain.com:7101" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "prescriptions-channel" ] && [ "$3" = "patients" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "prescriptions-channel" "cli.patients.medchain.com" "peer0.patients.medchain.com:7141"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "prescriptions-channel" ] && [ "$4" = "patients" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "prescriptions-channel" "cli.patients.medchain.com" "$TARGET_FILE" "peer0.patients.medchain.com:7141"

  elif [ "$1" = "fetch" ] && [ "$3" = "prescriptions-channel" ] && [ "$4" = "patients" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "prescriptions-channel" "cli.patients.medchain.com" "${BLOCK_NAME}" "peer0.patients.medchain.com:7141" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "lab-results-channel" ] && [ "$3" = "example" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "lab-results-channel" "cli.example.medchain.com" "peer0.example.medchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "lab-results-channel" ] && [ "$4" = "example" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "lab-results-channel" "cli.example.medchain.com" "$TARGET_FILE" "peer0.example.medchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$3" = "lab-results-channel" ] && [ "$4" = "example" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "lab-results-channel" "cli.example.medchain.com" "${BLOCK_NAME}" "peer0.example.medchain.com:7041" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "lab-results-channel" ] && [ "$3" = "ospedalemaresca" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "lab-results-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "lab-results-channel" ] && [ "$4" = "ospedalemaresca" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "lab-results-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "$TARGET_FILE" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061"

  elif [ "$1" = "fetch" ] && [ "$3" = "lab-results-channel" ] && [ "$4" = "ospedalemaresca" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "lab-results-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "${BLOCK_NAME}" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "lab-results-channel" ] && [ "$3" = "medicinageneralenapoli" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "lab-results-channel" "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "lab-results-channel" ] && [ "$4" = "medicinageneralenapoli" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "lab-results-channel" "cli.medicina-generale-napoli.medchain.com" "$TARGET_FILE" "peer0.medicina-generale-napoli.medchain.com:7081"

  elif [ "$1" = "fetch" ] && [ "$3" = "lab-results-channel" ] && [ "$4" = "medicinageneralenapoli" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "lab-results-channel" "cli.medicina-generale-napoli.medchain.com" "${BLOCK_NAME}" "peer0.medicina-generale-napoli.medchain.com:7081" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "lab-results-channel" ] && [ "$3" = "laboratorioanalisicmo" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "lab-results-channel" "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "lab-results-channel" ] && [ "$4" = "laboratorioanalisicmo" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "lab-results-channel" "cli.laboratorio-analisi-cmo.medchain.com" "$TARGET_FILE" "peer0.laboratorio-analisi-cmo.medchain.com:7121"

  elif [ "$1" = "fetch" ] && [ "$3" = "lab-results-channel" ] && [ "$4" = "laboratorioanalisicmo" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "lab-results-channel" "cli.laboratorio-analisi-cmo.medchain.com" "${BLOCK_NAME}" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "lab-results-channel" ] && [ "$3" = "patients" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "lab-results-channel" "cli.patients.medchain.com" "peer0.patients.medchain.com:7141"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "lab-results-channel" ] && [ "$4" = "patients" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "lab-results-channel" "cli.patients.medchain.com" "$TARGET_FILE" "peer0.patients.medchain.com:7141"

  elif [ "$1" = "fetch" ] && [ "$3" = "lab-results-channel" ] && [ "$4" = "patients" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "lab-results-channel" "cli.patients.medchain.com" "${BLOCK_NAME}" "peer0.patients.medchain.com:7141" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "identity-channel" ] && [ "$3" = "example" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "identity-channel" "cli.example.medchain.com" "peer0.example.medchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "identity-channel" ] && [ "$4" = "example" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "identity-channel" "cli.example.medchain.com" "$TARGET_FILE" "peer0.example.medchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$3" = "identity-channel" ] && [ "$4" = "example" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "identity-channel" "cli.example.medchain.com" "${BLOCK_NAME}" "peer0.example.medchain.com:7041" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "identity-channel" ] && [ "$3" = "ospedalemaresca" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "identity-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "identity-channel" ] && [ "$4" = "ospedalemaresca" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "identity-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "$TARGET_FILE" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061"

  elif [ "$1" = "fetch" ] && [ "$3" = "identity-channel" ] && [ "$4" = "ospedalemaresca" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "identity-channel" "cli.ospedale-maresca.aslnapoli3.medchain.com" "${BLOCK_NAME}" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "identity-channel" ] && [ "$3" = "medicinageneralenapoli" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "identity-channel" "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "identity-channel" ] && [ "$4" = "medicinageneralenapoli" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "identity-channel" "cli.medicina-generale-napoli.medchain.com" "$TARGET_FILE" "peer0.medicina-generale-napoli.medchain.com:7081"

  elif [ "$1" = "fetch" ] && [ "$3" = "identity-channel" ] && [ "$4" = "medicinageneralenapoli" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "identity-channel" "cli.medicina-generale-napoli.medchain.com" "${BLOCK_NAME}" "peer0.medicina-generale-napoli.medchain.com:7081" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "identity-channel" ] && [ "$3" = "farmaciapetrone" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "identity-channel" "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "identity-channel" ] && [ "$4" = "farmaciapetrone" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "identity-channel" "cli.farmacia-petrone.medchain.com" "$TARGET_FILE" "peer0.farmacia-petrone.medchain.com:7101"

  elif [ "$1" = "fetch" ] && [ "$3" = "identity-channel" ] && [ "$4" = "farmaciapetrone" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "identity-channel" "cli.farmacia-petrone.medchain.com" "${BLOCK_NAME}" "peer0.farmacia-petrone.medchain.com:7101" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "identity-channel" ] && [ "$3" = "laboratorioanalisicmo" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "identity-channel" "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "identity-channel" ] && [ "$4" = "laboratorioanalisicmo" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "identity-channel" "cli.laboratorio-analisi-cmo.medchain.com" "$TARGET_FILE" "peer0.laboratorio-analisi-cmo.medchain.com:7121"

  elif [ "$1" = "fetch" ] && [ "$3" = "identity-channel" ] && [ "$4" = "laboratorioanalisicmo" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "identity-channel" "cli.laboratorio-analisi-cmo.medchain.com" "${BLOCK_NAME}" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "identity-channel" ] && [ "$3" = "patients" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "identity-channel" "cli.patients.medchain.com" "peer0.patients.medchain.com:7141"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "identity-channel" ] && [ "$4" = "patients" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "identity-channel" "cli.patients.medchain.com" "$TARGET_FILE" "peer0.patients.medchain.com:7141"

  elif [ "$1" = "fetch" ] && [ "$3" = "identity-channel" ] && [ "$4" = "patients" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "identity-channel" "cli.patients.medchain.com" "${BLOCK_NAME}" "peer0.patients.medchain.com:7141" "$TARGET_FILE"

  else

    echo "$@"
    echo "$1, $2, $3, $4, $5, $6, $7, $#"
    printChannelsHelp
  fi

}

printChannelsHelp() {
  echo "Channel management commands:"
  echo ""

  echo "fablo channel list example peer0"
  echo -e "\t List channels on 'peer0' of 'example'".
  echo ""

  echo "fablo channel list ospedalemaresca peer0"
  echo -e "\t List channels on 'peer0' of 'OspedaleMaresca'".
  echo ""

  echo "fablo channel list medicinageneralenapoli peer0"
  echo -e "\t List channels on 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""

  echo "fablo channel list farmaciapetrone peer0"
  echo -e "\t List channels on 'peer0' of 'FarmaciaPetrone'".
  echo ""

  echo "fablo channel list laboratorioanalisicmo peer0"
  echo -e "\t List channels on 'peer0' of 'LaboratorioAnalisiCmo'".
  echo ""

  echo "fablo channel list patients peer0"
  echo -e "\t List channels on 'peer0' of 'Patients'".
  echo ""

  echo "fablo channel getinfo patient-records-channel example peer0"
  echo -e "\t Get channel info on 'peer0' of 'example'".
  echo ""
  echo "fablo channel fetch config patient-records-channel example peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'example'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> patient-records-channel example peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'example'".
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

  echo "fablo channel getinfo patient-records-channel medicinageneralenapoli peer0"
  echo -e "\t Get channel info on 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""
  echo "fablo channel fetch config patient-records-channel medicinageneralenapoli peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> patient-records-channel medicinageneralenapoli peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""

  echo "fablo channel getinfo patient-records-channel patients peer0"
  echo -e "\t Get channel info on 'peer0' of 'Patients'".
  echo ""
  echo "fablo channel fetch config patient-records-channel patients peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'Patients'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> patient-records-channel patients peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'Patients'".
  echo ""

  echo "fablo channel getinfo prescriptions-channel example peer0"
  echo -e "\t Get channel info on 'peer0' of 'example'".
  echo ""
  echo "fablo channel fetch config prescriptions-channel example peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'example'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> prescriptions-channel example peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'example'".
  echo ""

  echo "fablo channel getinfo prescriptions-channel ospedalemaresca peer0"
  echo -e "\t Get channel info on 'peer0' of 'OspedaleMaresca'".
  echo ""
  echo "fablo channel fetch config prescriptions-channel ospedalemaresca peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'OspedaleMaresca'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> prescriptions-channel ospedalemaresca peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'OspedaleMaresca'".
  echo ""

  echo "fablo channel getinfo prescriptions-channel medicinageneralenapoli peer0"
  echo -e "\t Get channel info on 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""
  echo "fablo channel fetch config prescriptions-channel medicinageneralenapoli peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> prescriptions-channel medicinageneralenapoli peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""

  echo "fablo channel getinfo prescriptions-channel farmaciapetrone peer0"
  echo -e "\t Get channel info on 'peer0' of 'FarmaciaPetrone'".
  echo ""
  echo "fablo channel fetch config prescriptions-channel farmaciapetrone peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'FarmaciaPetrone'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> prescriptions-channel farmaciapetrone peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'FarmaciaPetrone'".
  echo ""

  echo "fablo channel getinfo prescriptions-channel patients peer0"
  echo -e "\t Get channel info on 'peer0' of 'Patients'".
  echo ""
  echo "fablo channel fetch config prescriptions-channel patients peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'Patients'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> prescriptions-channel patients peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'Patients'".
  echo ""

  echo "fablo channel getinfo lab-results-channel example peer0"
  echo -e "\t Get channel info on 'peer0' of 'example'".
  echo ""
  echo "fablo channel fetch config lab-results-channel example peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'example'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> lab-results-channel example peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'example'".
  echo ""

  echo "fablo channel getinfo lab-results-channel ospedalemaresca peer0"
  echo -e "\t Get channel info on 'peer0' of 'OspedaleMaresca'".
  echo ""
  echo "fablo channel fetch config lab-results-channel ospedalemaresca peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'OspedaleMaresca'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> lab-results-channel ospedalemaresca peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'OspedaleMaresca'".
  echo ""

  echo "fablo channel getinfo lab-results-channel medicinageneralenapoli peer0"
  echo -e "\t Get channel info on 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""
  echo "fablo channel fetch config lab-results-channel medicinageneralenapoli peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> lab-results-channel medicinageneralenapoli peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""

  echo "fablo channel getinfo lab-results-channel laboratorioanalisicmo peer0"
  echo -e "\t Get channel info on 'peer0' of 'LaboratorioAnalisiCmo'".
  echo ""
  echo "fablo channel fetch config lab-results-channel laboratorioanalisicmo peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'LaboratorioAnalisiCmo'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> lab-results-channel laboratorioanalisicmo peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'LaboratorioAnalisiCmo'".
  echo ""

  echo "fablo channel getinfo lab-results-channel patients peer0"
  echo -e "\t Get channel info on 'peer0' of 'Patients'".
  echo ""
  echo "fablo channel fetch config lab-results-channel patients peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'Patients'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> lab-results-channel patients peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'Patients'".
  echo ""

  echo "fablo channel getinfo identity-channel example peer0"
  echo -e "\t Get channel info on 'peer0' of 'example'".
  echo ""
  echo "fablo channel fetch config identity-channel example peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'example'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> identity-channel example peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'example'".
  echo ""

  echo "fablo channel getinfo identity-channel ospedalemaresca peer0"
  echo -e "\t Get channel info on 'peer0' of 'OspedaleMaresca'".
  echo ""
  echo "fablo channel fetch config identity-channel ospedalemaresca peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'OspedaleMaresca'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> identity-channel ospedalemaresca peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'OspedaleMaresca'".
  echo ""

  echo "fablo channel getinfo identity-channel medicinageneralenapoli peer0"
  echo -e "\t Get channel info on 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""
  echo "fablo channel fetch config identity-channel medicinageneralenapoli peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> identity-channel medicinageneralenapoli peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'MedicinaGeneraleNapoli'".
  echo ""

  echo "fablo channel getinfo identity-channel farmaciapetrone peer0"
  echo -e "\t Get channel info on 'peer0' of 'FarmaciaPetrone'".
  echo ""
  echo "fablo channel fetch config identity-channel farmaciapetrone peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'FarmaciaPetrone'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> identity-channel farmaciapetrone peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'FarmaciaPetrone'".
  echo ""

  echo "fablo channel getinfo identity-channel laboratorioanalisicmo peer0"
  echo -e "\t Get channel info on 'peer0' of 'LaboratorioAnalisiCmo'".
  echo ""
  echo "fablo channel fetch config identity-channel laboratorioanalisicmo peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'LaboratorioAnalisiCmo'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> identity-channel laboratorioanalisicmo peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'LaboratorioAnalisiCmo'".
  echo ""

  echo "fablo channel getinfo identity-channel patients peer0"
  echo -e "\t Get channel info on 'peer0' of 'Patients'".
  echo ""
  echo "fablo channel fetch config identity-channel patients peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'Patients'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> identity-channel patients peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'Patients'".
  echo ""

}
