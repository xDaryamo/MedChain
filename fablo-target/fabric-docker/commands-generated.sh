#!/usr/bin/env bash

generateArtifacts() {
  printHeadline "Generating basic configs" "U1F913"

  printItalics "Generating crypto material for Orderer" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-orderer.yaml" "peerOrganizations/orderer.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for OspedaleMaresca" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-ospedalemaresca.yaml" "peerOrganizations/ospedale-maresca.aslnapoli3.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating genesis block for group medchain-orderergroup" "U1F3E0"
  genesisBlockCreate "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config" "Medchain-orderergroupGenesis"

  # Create directory for chaincode packages to avoid permission errors on linux
  mkdir -p "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"
}

startNetwork() {
  printHeadline "Starting network" "U1F680"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose up -d)
  sleep 4
}

generateChannelsArtifacts() {
  printHeadline "Generating config for 'patient-records-channel'" "U1F913"
  createChannelTx "patient-records-channel" "$FABLO_NETWORK_ROOT/fabric-config" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config/config"
}

installChannels() {
  printHeadline "Creating 'patient-records-channel' on OspedaleMaresca/peer0" "U1F63B"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'patient-records-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7041' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

}

installChaincodes() {
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient")" ]; then
    local version="0.1"
    printHeadline "Packaging chaincode 'patient'" "U1F60E"
    chaincodeBuild "patient" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient" "16"
    chaincodePackage "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient" "$version" "golang" printHeadline "Installing 'patient' for OspedaleMaresca" "U1F60E"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient" "$version" ""
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'patient' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
    chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "" ""
  else
    echo "Warning! Skipping chaincode 'patient' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient'"
  fi
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization")" ]; then
    local version="0.1"
    printHeadline "Packaging chaincode 'organization'" "U1F60E"
    chaincodeBuild "organization" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization" "16"
    chaincodePackage "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "organization" "$version" "golang" printHeadline "Installing 'organization' for OspedaleMaresca" "U1F60E"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "organization" "$version" ""
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'organization' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
    chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "" ""
  else
    echo "Warning! Skipping chaincode 'organization' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization'"
  fi

}

installChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "patient" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient")" ]; then
      printHeadline "Packaging chaincode 'patient'" "U1F60E"
      chaincodeBuild "patient" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient" "16"
      chaincodePackage "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient" "$version" "golang" printHeadline "Installing 'patient' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'patient' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
      chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "" ""

    else
      echo "Warning! Skipping chaincode 'patient' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient'"
    fi
  fi
  if [ "$chaincodeName" = "organization" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization")" ]; then
      printHeadline "Packaging chaincode 'organization'" "U1F60E"
      chaincodeBuild "organization" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization" "16"
      chaincodePackage "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "organization" "$version" "golang" printHeadline "Installing 'organization' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "organization" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'organization' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
      chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "" ""

    else
      echo "Warning! Skipping chaincode 'organization' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization'"
    fi
  fi
}

runDevModeChaincode() {
  local chaincodeName=$1
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "patient" ]; then
    local version="0.1"
    printHeadline "Approving 'patient' for OspedaleMaresca (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'patient' on channel 'patient-records-channel' as 'OspedaleMaresca' (dev mode)" "U1F618"
    chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "" ""

  fi
  if [ "$chaincodeName" = "organization" ]; then
    local version="0.1"
    printHeadline "Approving 'organization' for OspedaleMaresca (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'organization' on channel 'patient-records-channel' as 'OspedaleMaresca' (dev mode)" "U1F618"
    chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "" ""

  fi
}

upgradeChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "patient" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient")" ]; then
      printHeadline "Packaging chaincode 'patient'" "U1F60E"
      chaincodeBuild "patient" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient" "16"
      chaincodePackage "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient" "$version" "golang" printHeadline "Installing 'patient' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'patient' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
      chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "" ""

    else
      echo "Warning! Skipping chaincode 'patient' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient'"
    fi
  fi
  if [ "$chaincodeName" = "organization" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization")" ]; then
      printHeadline "Packaging chaincode 'organization'" "U1F60E"
      chaincodeBuild "organization" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization" "16"
      chaincodePackage "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "organization" "$version" "golang" printHeadline "Installing 'organization' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "organization" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'organization' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
      chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "" ""

    else
      echo "Warning! Skipping chaincode 'organization' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization'"
    fi
  fi
}

notifyOrgsAboutChannels() {
  printHeadline "Creating new channel config blocks" "U1F537"
  createNewChannelUpdateTx "patient-records-channel" "OspedaleMarescaMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"

  printHeadline "Notyfing orgs about channels" "U1F4E2"
  notifyOrgAboutNewChannel "patient-records-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"

  printHeadline "Deleting new channel config blocks" "U1F52A"
  deleteNewChannelUpdateTx "patient-records-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com"
}

printStartSuccessInfo() {
  printHeadline "Done! Enjoy your fresh network" "U1F984"
}

stopNetwork() {
  printHeadline "Stopping network" "U1F68F"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose stop)
  sleep 4
}

networkDown() {
  printHeadline "Destroying network" "U1F916"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose down)

  printf "Removing chaincode containers & images... \U1F5D1 \n"
  for container in $(docker ps -a | grep "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-patient*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-organization*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done

  printf "Removing generated configs... \U1F5D1 \n"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/crypto-config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"

  printHeadline "Done! Network was purged" "U1F5D1"
}
