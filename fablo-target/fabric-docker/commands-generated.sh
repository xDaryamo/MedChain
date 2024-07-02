#!/usr/bin/env bash

generateArtifacts() {
  printHeadline "Generating basic configs" "U1F913"

  printItalics "Generating crypto material for Orderer" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-orderer.yaml" "peerOrganizations/orderer.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for example" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-example.yaml" "peerOrganizations/example.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for OspedaleMaresca" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-ospedalemaresca.yaml" "peerOrganizations/ospedale-maresca.aslnapoli3.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for MedicinaGeneraleNapoli" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-medicinageneralenapoli.yaml" "peerOrganizations/medicina-generale-napoli.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for FarmaciaPetrone" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-farmaciapetrone.yaml" "peerOrganizations/farmacia-petrone.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for LaboratorioAnalisiCmo" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-laboratorioanalisicmo.yaml" "peerOrganizations/laboratorio-analisi-cmo.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for Patients" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-patients.yaml" "peerOrganizations/patients.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

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
  printHeadline "Generating config for 'prescriptions-channel'" "U1F913"
  createChannelTx "prescriptions-channel" "$FABLO_NETWORK_ROOT/fabric-config" "PrescriptionsChannel" "$FABLO_NETWORK_ROOT/fabric-config/config"
  printHeadline "Generating config for 'lab-results-channel'" "U1F913"
  createChannelTx "lab-results-channel" "$FABLO_NETWORK_ROOT/fabric-config" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config/config"
  printHeadline "Generating config for 'identity-channel'" "U1F913"
  createChannelTx "identity-channel" "$FABLO_NETWORK_ROOT/fabric-config" "IdentityChannel" "$FABLO_NETWORK_ROOT/fabric-config/config"
}

installChannels() {
  printHeadline "Creating 'patient-records-channel' on example/peer0" "U1F63B"
  docker exec -i cli.example.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'patient-records-channel' 'exampleMSP' 'peer0.example.medchain.com:7041' 'crypto/users/Admin@example.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'patient-records-channel' on  OspedaleMaresca/peer0" "U1F638"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'patient-records-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7061' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  MedicinaGeneraleNapoli/peer0" "U1F638"
  docker exec -i cli.medicina-generale-napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'patient-records-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale-napoli.medchain.com:7081' 'crypto/users/Admin@medicina-generale-napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  Patients/peer0" "U1F638"
  docker exec -i cli.patients.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'patient-records-channel' 'PatientsMSP' 'peer0.patients.medchain.com:7141' 'crypto/users/Admin@patients.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'prescriptions-channel' on example/peer0" "U1F63B"
  docker exec -i cli.example.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'prescriptions-channel' 'exampleMSP' 'peer0.example.medchain.com:7041' 'crypto/users/Admin@example.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'prescriptions-channel' on  MedicinaGeneraleNapoli/peer0" "U1F638"
  docker exec -i cli.medicina-generale-napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'prescriptions-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale-napoli.medchain.com:7081' 'crypto/users/Admin@medicina-generale-napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'prescriptions-channel' on  FarmaciaPetrone/peer0" "U1F638"
  docker exec -i cli.farmacia-petrone.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'prescriptions-channel' 'FarmaciaPetroneMSP' 'peer0.farmacia-petrone.medchain.com:7101' 'crypto/users/Admin@farmacia-petrone.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'prescriptions-channel' on  Patients/peer0" "U1F638"
  docker exec -i cli.patients.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'prescriptions-channel' 'PatientsMSP' 'peer0.patients.medchain.com:7141' 'crypto/users/Admin@patients.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'lab-results-channel' on example/peer0" "U1F63B"
  docker exec -i cli.example.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'lab-results-channel' 'exampleMSP' 'peer0.example.medchain.com:7041' 'crypto/users/Admin@example.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'lab-results-channel' on  OspedaleMaresca/peer0" "U1F638"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'lab-results-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7061' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  MedicinaGeneraleNapoli/peer0" "U1F638"
  docker exec -i cli.medicina-generale-napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'lab-results-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale-napoli.medchain.com:7081' 'crypto/users/Admin@medicina-generale-napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  LaboratorioAnalisiCmo/peer0" "U1F638"
  docker exec -i cli.laboratorio-analisi-cmo.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'lab-results-channel' 'LaboratorioAnalisiCmoMSP' 'peer0.laboratorio-analisi-cmo.medchain.com:7121' 'crypto/users/Admin@laboratorio-analisi-cmo.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  Patients/peer0" "U1F638"
  docker exec -i cli.patients.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'lab-results-channel' 'PatientsMSP' 'peer0.patients.medchain.com:7141' 'crypto/users/Admin@patients.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'identity-channel' on example/peer0" "U1F63B"
  docker exec -i cli.example.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'identity-channel' 'exampleMSP' 'peer0.example.medchain.com:7041' 'crypto/users/Admin@example.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'identity-channel' on  OspedaleMaresca/peer0" "U1F638"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'identity-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7061' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'identity-channel' on  MedicinaGeneraleNapoli/peer0" "U1F638"
  docker exec -i cli.medicina-generale-napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'identity-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale-napoli.medchain.com:7081' 'crypto/users/Admin@medicina-generale-napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'identity-channel' on  FarmaciaPetrone/peer0" "U1F638"
  docker exec -i cli.farmacia-petrone.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'identity-channel' 'FarmaciaPetroneMSP' 'peer0.farmacia-petrone.medchain.com:7101' 'crypto/users/Admin@farmacia-petrone.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'identity-channel' on  LaboratorioAnalisiCmo/peer0" "U1F638"
  docker exec -i cli.laboratorio-analisi-cmo.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'identity-channel' 'LaboratorioAnalisiCmoMSP' 'peer0.laboratorio-analisi-cmo.medchain.com:7121' 'crypto/users/Admin@laboratorio-analisi-cmo.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'identity-channel' on  Patients/peer0" "U1F638"
  docker exec -i cli.patients.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'identity-channel' 'PatientsMSP' 'peer0.patients.medchain.com:7141' 'crypto/users/Admin@patients.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
}

installChaincodes() {
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient")" ]; then
    local version="0.1"
    printHeadline "Packaging chaincode 'patient'" "U1F60E"
    chaincodeBuild "patient" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient" "16"
    chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient" "$version" "golang" printHeadline "Installing 'patient' for example" "U1F60E"
    chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient" "$version" ""
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'patient' for OspedaleMaresca" "U1F60E"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient" "$version" ""
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'patient' for MedicinaGeneraleNapoli" "U1F60E"
    chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient" "$version" ""
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'patient' for FarmaciaPetrone" "U1F60E"
    chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "patient" "$version" ""
    chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'patient' for LaboratorioAnalisiCmo" "U1F60E"
    chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "patient" "$version" ""
    chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'patient' for Patients" "U1F60E"
    chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient" "$version" ""
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'patient' on channel 'identity-channel' as 'example'" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""
  else
    echo "Warning! Skipping chaincode 'patient' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient'"
  fi
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/labresults")" ]; then
    local version="0.1"
    printHeadline "Packaging chaincode 'labresults'" "U1F60E"
    chaincodeBuild "labresults" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/labresults" "16"
    chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "labresults" "$version" "golang" printHeadline "Installing 'labresults' for example" "U1F60E"
    chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "labresults" "$version" ""
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'labresults' for OspedaleMaresca" "U1F60E"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "labresults" "$version" ""
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'labresults' for MedicinaGeneraleNapoli" "U1F60E"
    chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "labresults" "$version" ""
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'labresults' for LaboratorioAnalisiCmo" "U1F60E"
    chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "labresults" "$version" ""
    chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'labresults' for Patients" "U1F60E"
    chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "labresults" "$version" ""
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'labresults' on channel 'lab-results-channel' as 'example'" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""
  else
    echo "Warning! Skipping chaincode 'labresults' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/labresults'"
  fi
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/practitioner")" ]; then
    local version="0.1"
    printHeadline "Packaging chaincode 'practitioner'" "U1F60E"
    chaincodeBuild "practitioner" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/practitioner" "16"
    chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "practitioner" "$version" "golang" printHeadline "Installing 'practitioner' for example" "U1F60E"
    chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "practitioner" "$version" ""
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'practitioner' for OspedaleMaresca" "U1F60E"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "practitioner" "$version" ""
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'practitioner' for MedicinaGeneraleNapoli" "U1F60E"
    chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "practitioner" "$version" ""
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'practitioner' for FarmaciaPetrone" "U1F60E"
    chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "practitioner" "$version" ""
    chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'practitioner' for LaboratorioAnalisiCmo" "U1F60E"
    chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "practitioner" "$version" ""
    chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'practitioner' for Patients" "U1F60E"
    chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "practitioner" "$version" ""
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'practitioner' on channel 'identity-channel' as 'example'" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""
  else
    echo "Warning! Skipping chaincode 'practitioner' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/practitioner'"
  fi
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/records")" ]; then
    local version="0.1"
    printHeadline "Packaging chaincode 'records'" "U1F60E"
    chaincodeBuild "records" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/records" "16"
    chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "records" "$version" "golang" printHeadline "Installing 'records' for example" "U1F60E"
    chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "records" "$version" ""
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'records' for OspedaleMaresca" "U1F60E"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "records" "$version" ""
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'records' for MedicinaGeneraleNapoli" "U1F60E"
    chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "records" "$version" ""
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'records' for Patients" "U1F60E"
    chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "records" "$version" ""
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'records' on channel 'patient-records-channel' as 'example'" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.patients.medchain.com:7141" "" ""
  else
    echo "Warning! Skipping chaincode 'records' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/records'"
  fi
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization")" ]; then
    local version="0.1"
    printHeadline "Packaging chaincode 'organization'" "U1F60E"
    chaincodeBuild "organization" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization" "16"
    chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "organization" "$version" "golang" printHeadline "Installing 'organization' for example" "U1F60E"
    chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "organization" "$version" ""
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'organization' for OspedaleMaresca" "U1F60E"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "organization" "$version" ""
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'organization' for MedicinaGeneraleNapoli" "U1F60E"
    chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "organization" "$version" ""
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'organization' for FarmaciaPetrone" "U1F60E"
    chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "organization" "$version" ""
    chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'organization' for LaboratorioAnalisiCmo" "U1F60E"
    chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "organization" "$version" ""
    chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'organization' for Patients" "U1F60E"
    chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "organization" "$version" ""
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'organization' on channel 'identity-channel' as 'example'" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""
  else
    echo "Warning! Skipping chaincode 'organization' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization'"
  fi
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/prescription")" ]; then
    local version="0.1"
    printHeadline "Packaging chaincode 'prescription'" "U1F60E"
    chaincodeBuild "prescription" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/prescription" "16"
    chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescription" "$version" "golang" printHeadline "Installing 'prescription' for example" "U1F60E"
    chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescription" "$version" ""
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'prescription' for MedicinaGeneraleNapoli" "U1F60E"
    chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "prescription" "$version" ""
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'prescription' for FarmaciaPetrone" "U1F60E"
    chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "prescription" "$version" ""
    chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'prescription' for Patients" "U1F60E"
    chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "prescription" "$version" ""
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'prescription' on channel 'prescriptions-channel' as 'example'" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.patients.medchain.com:7141" "" ""
  else
    echo "Warning! Skipping chaincode 'prescription' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/prescription'"
  fi
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/encounter")" ]; then
    local version="0.1"
    printHeadline "Packaging chaincode 'encounter'" "U1F60E"
    chaincodeBuild "encounter" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/encounter" "16"
    chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "encounter" "$version" "golang" printHeadline "Installing 'encounter' for example" "U1F60E"
    chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "encounter" "$version" ""
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'encounter' for OspedaleMaresca" "U1F60E"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "encounter" "$version" ""
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'encounter' for MedicinaGeneraleNapoli" "U1F60E"
    chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "encounter" "$version" ""
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'encounter' for Patients" "U1F60E"
    chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "encounter" "$version" ""
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'encounter' on channel 'patient-records-channel' as 'example'" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.patients.medchain.com:7141" "" ""
  else
    echo "Warning! Skipping chaincode 'encounter' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/encounter'"
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
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient" "$version" "golang" printHeadline "Installing 'patient' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for FarmaciaPetrone" "U1F60E"
      chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "patient" "$version" ""
      chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for LaboratorioAnalisiCmo" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "patient" "$version" ""
      chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'patient' on channel 'identity-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'patient' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient'"
    fi
  fi
  if [ "$chaincodeName" = "labresults" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/labresults")" ]; then
      printHeadline "Packaging chaincode 'labresults'" "U1F60E"
      chaincodeBuild "labresults" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/labresults" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "labresults" "$version" "golang" printHeadline "Installing 'labresults' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "labresults" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'labresults' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "labresults" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'labresults' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "labresults" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'labresults' for LaboratorioAnalisiCmo" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "labresults" "$version" ""
      chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'labresults' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "labresults" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'labresults' on channel 'lab-results-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'labresults' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/labresults'"
    fi
  fi
  if [ "$chaincodeName" = "practitioner" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/practitioner")" ]; then
      printHeadline "Packaging chaincode 'practitioner'" "U1F60E"
      chaincodeBuild "practitioner" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/practitioner" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "practitioner" "$version" "golang" printHeadline "Installing 'practitioner' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "practitioner" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'practitioner' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "practitioner" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'practitioner' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "practitioner" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'practitioner' for FarmaciaPetrone" "U1F60E"
      chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "practitioner" "$version" ""
      chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'practitioner' for LaboratorioAnalisiCmo" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "practitioner" "$version" ""
      chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'practitioner' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "practitioner" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'practitioner' on channel 'identity-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'practitioner' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/practitioner'"
    fi
  fi
  if [ "$chaincodeName" = "records" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/records")" ]; then
      printHeadline "Packaging chaincode 'records'" "U1F60E"
      chaincodeBuild "records" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/records" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "records" "$version" "golang" printHeadline "Installing 'records' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "records" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'records' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "records" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'records' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "records" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'records' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "records" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'records' on channel 'patient-records-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'records' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/records'"
    fi
  fi
  if [ "$chaincodeName" = "organization" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization")" ]; then
      printHeadline "Packaging chaincode 'organization'" "U1F60E"
      chaincodeBuild "organization" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "organization" "$version" "golang" printHeadline "Installing 'organization' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "organization" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "organization" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "organization" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for FarmaciaPetrone" "U1F60E"
      chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "organization" "$version" ""
      chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for LaboratorioAnalisiCmo" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "organization" "$version" ""
      chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "organization" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'organization' on channel 'identity-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'organization' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization'"
    fi
  fi
  if [ "$chaincodeName" = "prescription" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/prescription")" ]; then
      printHeadline "Packaging chaincode 'prescription'" "U1F60E"
      chaincodeBuild "prescription" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/prescription" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescription" "$version" "golang" printHeadline "Installing 'prescription' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescription" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'prescription' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "prescription" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'prescription' for FarmaciaPetrone" "U1F60E"
      chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "prescription" "$version" ""
      chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'prescription' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "prescription" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'prescription' on channel 'prescriptions-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'prescription' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/prescription'"
    fi
  fi
  if [ "$chaincodeName" = "encounter" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/encounter")" ]; then
      printHeadline "Packaging chaincode 'encounter'" "U1F60E"
      chaincodeBuild "encounter" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/encounter" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "encounter" "$version" "golang" printHeadline "Installing 'encounter' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "encounter" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'encounter' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "encounter" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'encounter' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "encounter" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'encounter' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "encounter" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'encounter' on channel 'patient-records-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'encounter' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/encounter'"
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
    printHeadline "Approving 'patient' for example (dev mode)" "U1F60E"
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'patient' for OspedaleMaresca (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'patient' for MedicinaGeneraleNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'patient' for FarmaciaPetrone (dev mode)" "U1F60E"
    chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'patient' for LaboratorioAnalisiCmo (dev mode)" "U1F60E"
    chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'patient' for Patients (dev mode)" "U1F60E"
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'patient' on channel 'identity-channel' as 'example' (dev mode)" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

  fi
  if [ "$chaincodeName" = "labresults" ]; then
    local version="0.1"
    printHeadline "Approving 'labresults' for example (dev mode)" "U1F60E"
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "lab-results-channel" "labresults" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'labresults' for OspedaleMaresca (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "lab-results-channel" "labresults" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'labresults' for MedicinaGeneraleNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "lab-results-channel" "labresults" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'labresults' for LaboratorioAnalisiCmo (dev mode)" "U1F60E"
    chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "lab-results-channel" "labresults" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'labresults' for Patients (dev mode)" "U1F60E"
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "lab-results-channel" "labresults" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'labresults' on channel 'lab-results-channel' as 'example' (dev mode)" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "lab-results-channel" "labresults" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

  fi
  if [ "$chaincodeName" = "practitioner" ]; then
    local version="0.1"
    printHeadline "Approving 'practitioner' for example (dev mode)" "U1F60E"
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "practitioner" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'practitioner' for OspedaleMaresca (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "practitioner" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'practitioner' for MedicinaGeneraleNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "practitioner" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'practitioner' for FarmaciaPetrone (dev mode)" "U1F60E"
    chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "practitioner" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'practitioner' for LaboratorioAnalisiCmo (dev mode)" "U1F60E"
    chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "practitioner" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'practitioner' for Patients (dev mode)" "U1F60E"
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "practitioner" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'practitioner' on channel 'identity-channel' as 'example' (dev mode)" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "practitioner" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

  fi
  if [ "$chaincodeName" = "records" ]; then
    local version="0.1"
    printHeadline "Approving 'records' for example (dev mode)" "U1F60E"
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "records" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'records' for OspedaleMaresca (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient-records-channel" "records" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'records' for MedicinaGeneraleNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient-records-channel" "records" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'records' for Patients (dev mode)" "U1F60E"
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient-records-channel" "records" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'records' on channel 'patient-records-channel' as 'example' (dev mode)" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "records" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.patients.medchain.com:7141" "" ""

  fi
  if [ "$chaincodeName" = "organization" ]; then
    local version="0.1"
    printHeadline "Approving 'organization' for example (dev mode)" "U1F60E"
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'organization' for OspedaleMaresca (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'organization' for MedicinaGeneraleNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'organization' for FarmaciaPetrone (dev mode)" "U1F60E"
    chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'organization' for LaboratorioAnalisiCmo (dev mode)" "U1F60E"
    chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'organization' for Patients (dev mode)" "U1F60E"
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'organization' on channel 'identity-channel' as 'example' (dev mode)" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

  fi
  if [ "$chaincodeName" = "prescription" ]; then
    local version="0.1"
    printHeadline "Approving 'prescription' for example (dev mode)" "U1F60E"
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescriptions-channel" "prescription" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'prescription' for MedicinaGeneraleNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "prescriptions-channel" "prescription" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'prescription' for FarmaciaPetrone (dev mode)" "U1F60E"
    chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "prescriptions-channel" "prescription" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'prescription' for Patients (dev mode)" "U1F60E"
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "prescriptions-channel" "prescription" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'prescription' on channel 'prescriptions-channel' as 'example' (dev mode)" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescriptions-channel" "prescription" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.patients.medchain.com:7141" "" ""

  fi
  if [ "$chaincodeName" = "encounter" ]; then
    local version="0.1"
    printHeadline "Approving 'encounter' for example (dev mode)" "U1F60E"
    chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "encounter" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'encounter' for OspedaleMaresca (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient-records-channel" "encounter" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'encounter' for MedicinaGeneraleNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient-records-channel" "encounter" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'encounter' for Patients (dev mode)" "U1F60E"
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient-records-channel" "encounter" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'encounter' on channel 'patient-records-channel' as 'example' (dev mode)" "U1F618"
    chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "encounter" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.patients.medchain.com:7141" "" ""

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
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient" "$version" "golang" printHeadline "Installing 'patient' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for FarmaciaPetrone" "U1F60E"
      chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "patient" "$version" ""
      chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for LaboratorioAnalisiCmo" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "patient" "$version" ""
      chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'patient' on channel 'identity-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'patient' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient'"
    fi
  fi
  if [ "$chaincodeName" = "labresults" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/labresults")" ]; then
      printHeadline "Packaging chaincode 'labresults'" "U1F60E"
      chaincodeBuild "labresults" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/labresults" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "labresults" "$version" "golang" printHeadline "Installing 'labresults' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "labresults" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'labresults' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "labresults" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'labresults' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "labresults" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'labresults' for LaboratorioAnalisiCmo" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "labresults" "$version" ""
      chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'labresults' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "labresults" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'labresults' on channel 'lab-results-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "lab-results-channel" "labresults" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'labresults' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/labresults'"
    fi
  fi
  if [ "$chaincodeName" = "practitioner" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/practitioner")" ]; then
      printHeadline "Packaging chaincode 'practitioner'" "U1F60E"
      chaincodeBuild "practitioner" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/practitioner" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "practitioner" "$version" "golang" printHeadline "Installing 'practitioner' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "practitioner" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'practitioner' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "practitioner" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'practitioner' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "practitioner" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'practitioner' for FarmaciaPetrone" "U1F60E"
      chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "practitioner" "$version" ""
      chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'practitioner' for LaboratorioAnalisiCmo" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "practitioner" "$version" ""
      chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'practitioner' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "practitioner" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'practitioner' on channel 'identity-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "practitioner" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'practitioner' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/practitioner'"
    fi
  fi
  if [ "$chaincodeName" = "records" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/records")" ]; then
      printHeadline "Packaging chaincode 'records'" "U1F60E"
      chaincodeBuild "records" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/records" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "records" "$version" "golang" printHeadline "Installing 'records' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "records" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'records' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "records" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'records' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "records" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'records' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "records" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'records' on channel 'patient-records-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "records" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'records' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/records'"
    fi
  fi
  if [ "$chaincodeName" = "organization" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization")" ]; then
      printHeadline "Packaging chaincode 'organization'" "U1F60E"
      chaincodeBuild "organization" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "organization" "$version" "golang" printHeadline "Installing 'organization' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "organization" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "organization" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "organization" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for FarmaciaPetrone" "U1F60E"
      chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "organization" "$version" ""
      chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for LaboratorioAnalisiCmo" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "organization" "$version" ""
      chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7121" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "organization" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'organization' on channel 'identity-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "identity-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.laboratorio-analisi-cmo.medchain.com:7121,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'organization' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization'"
    fi
  fi
  if [ "$chaincodeName" = "prescription" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/prescription")" ]; then
      printHeadline "Packaging chaincode 'prescription'" "U1F60E"
      chaincodeBuild "prescription" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/prescription" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescription" "$version" "golang" printHeadline "Installing 'prescription' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescription" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'prescription' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "prescription" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'prescription' for FarmaciaPetrone" "U1F60E"
      chaincodeInstall "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "prescription" "$version" ""
      chaincodeApprove "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com:7101" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'prescription' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "prescription" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'prescription' on channel 'prescriptions-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "prescriptions-channel" "prescription" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.medicina-generale-napoli.medchain.com:7081,peer0.farmacia-petrone.medchain.com:7101,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'prescription' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/prescription'"
    fi
  fi
  if [ "$chaincodeName" = "encounter" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/encounter")" ]; then
      printHeadline "Packaging chaincode 'encounter'" "U1F60E"
      chaincodeBuild "encounter" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/encounter" "16"
      chaincodePackage "cli.example.medchain.com" "peer0.example.medchain.com:7041" "encounter" "$version" "golang" printHeadline "Installing 'encounter' for example" "U1F60E"
      chaincodeInstall "cli.example.medchain.com" "peer0.example.medchain.com:7041" "encounter" "$version" ""
      chaincodeApprove "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'encounter' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "encounter" "$version" ""
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7061" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'encounter' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "encounter" "$version" ""
      chaincodeApprove "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com:7081" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'encounter' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "encounter" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7141" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'encounter' on channel 'patient-records-channel' as 'example'" "U1F618"
      chaincodeCommit "cli.example.medchain.com" "peer0.example.medchain.com:7041" "patient-records-channel" "encounter" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.example.medchain.com:7041,peer0.ospedale-maresca.aslnapoli3.medchain.com:7061,peer0.medicina-generale-napoli.medchain.com:7081,peer0.patients.medchain.com:7141" "" ""

    else
      echo "Warning! Skipping chaincode 'encounter' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/encounter'"
    fi
  fi
}

notifyOrgsAboutChannels() {
  printHeadline "Creating new channel config blocks" "U1F537"
  createNewChannelUpdateTx "patient-records-channel" "exampleMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "patient-records-channel" "OspedaleMarescaMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "patient-records-channel" "MedicinaGeneraleNapoliMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "patient-records-channel" "PatientsMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "prescriptions-channel" "exampleMSP" "PrescriptionsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "prescriptions-channel" "MedicinaGeneraleNapoliMSP" "PrescriptionsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "prescriptions-channel" "FarmaciaPetroneMSP" "PrescriptionsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "prescriptions-channel" "PatientsMSP" "PrescriptionsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "lab-results-channel" "exampleMSP" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "lab-results-channel" "OspedaleMarescaMSP" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "lab-results-channel" "MedicinaGeneraleNapoliMSP" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "lab-results-channel" "LaboratorioAnalisiCmoMSP" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "lab-results-channel" "PatientsMSP" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "identity-channel" "exampleMSP" "IdentityChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "identity-channel" "OspedaleMarescaMSP" "IdentityChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "identity-channel" "MedicinaGeneraleNapoliMSP" "IdentityChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "identity-channel" "FarmaciaPetroneMSP" "IdentityChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "identity-channel" "LaboratorioAnalisiCmoMSP" "IdentityChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "identity-channel" "PatientsMSP" "IdentityChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"

  printHeadline "Notyfing orgs about channels" "U1F4E2"
  notifyOrgAboutNewChannel "patient-records-channel" "exampleMSP" "cli.example.medchain.com" "peer0.example.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "patient-records-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "patient-records-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "patient-records-channel" "PatientsMSP" "cli.patients.medchain.com" "peer0.patients.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "prescriptions-channel" "exampleMSP" "cli.example.medchain.com" "peer0.example.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "prescriptions-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "prescriptions-channel" "FarmaciaPetroneMSP" "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "prescriptions-channel" "PatientsMSP" "cli.patients.medchain.com" "peer0.patients.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "lab-results-channel" "exampleMSP" "cli.example.medchain.com" "peer0.example.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "lab-results-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "lab-results-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "lab-results-channel" "LaboratorioAnalisiCmoMSP" "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "lab-results-channel" "PatientsMSP" "cli.patients.medchain.com" "peer0.patients.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "identity-channel" "exampleMSP" "cli.example.medchain.com" "peer0.example.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "identity-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "identity-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale-napoli.medchain.com" "peer0.medicina-generale-napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "identity-channel" "FarmaciaPetroneMSP" "cli.farmacia-petrone.medchain.com" "peer0.farmacia-petrone.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "identity-channel" "LaboratorioAnalisiCmoMSP" "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "identity-channel" "PatientsMSP" "cli.patients.medchain.com" "peer0.patients.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"

  printHeadline "Deleting new channel config blocks" "U1F52A"
  deleteNewChannelUpdateTx "patient-records-channel" "exampleMSP" "cli.example.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale-napoli.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "PatientsMSP" "cli.patients.medchain.com"
  deleteNewChannelUpdateTx "prescriptions-channel" "exampleMSP" "cli.example.medchain.com"
  deleteNewChannelUpdateTx "prescriptions-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale-napoli.medchain.com"
  deleteNewChannelUpdateTx "prescriptions-channel" "FarmaciaPetroneMSP" "cli.farmacia-petrone.medchain.com"
  deleteNewChannelUpdateTx "prescriptions-channel" "PatientsMSP" "cli.patients.medchain.com"
  deleteNewChannelUpdateTx "lab-results-channel" "exampleMSP" "cli.example.medchain.com"
  deleteNewChannelUpdateTx "lab-results-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com"
  deleteNewChannelUpdateTx "lab-results-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale-napoli.medchain.com"
  deleteNewChannelUpdateTx "lab-results-channel" "LaboratorioAnalisiCmoMSP" "cli.laboratorio-analisi-cmo.medchain.com"
  deleteNewChannelUpdateTx "lab-results-channel" "PatientsMSP" "cli.patients.medchain.com"
  deleteNewChannelUpdateTx "identity-channel" "exampleMSP" "cli.example.medchain.com"
  deleteNewChannelUpdateTx "identity-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com"
  deleteNewChannelUpdateTx "identity-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale-napoli.medchain.com"
  deleteNewChannelUpdateTx "identity-channel" "FarmaciaPetroneMSP" "cli.farmacia-petrone.medchain.com"
  deleteNewChannelUpdateTx "identity-channel" "LaboratorioAnalisiCmoMSP" "cli.laboratorio-analisi-cmo.medchain.com"
  deleteNewChannelUpdateTx "identity-channel" "PatientsMSP" "cli.patients.medchain.com"
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
  for container in $(docker ps -a | grep "dev-peer0.example.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.example.medchain.com-patient*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-patient*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.medicina-generale-napoli.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.medicina-generale-napoli.medchain.com-patient*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.farmacia-petrone.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.farmacia-petrone.medchain.com-patient*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.laboratorio-analisi-cmo.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.laboratorio-analisi-cmo.medchain.com-patient*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.patients.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.patients.medchain.com-patient*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.example.medchain.com-labresults" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.example.medchain.com-labresults*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-labresults" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-labresults*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.medicina-generale-napoli.medchain.com-labresults" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.medicina-generale-napoli.medchain.com-labresults*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.laboratorio-analisi-cmo.medchain.com-labresults" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.laboratorio-analisi-cmo.medchain.com-labresults*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.patients.medchain.com-labresults" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.patients.medchain.com-labresults*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.example.medchain.com-practitioner" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.example.medchain.com-practitioner*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-practitioner" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-practitioner*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.medicina-generale-napoli.medchain.com-practitioner" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.medicina-generale-napoli.medchain.com-practitioner*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.farmacia-petrone.medchain.com-practitioner" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.farmacia-petrone.medchain.com-practitioner*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.laboratorio-analisi-cmo.medchain.com-practitioner" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.laboratorio-analisi-cmo.medchain.com-practitioner*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.patients.medchain.com-practitioner" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.patients.medchain.com-practitioner*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.example.medchain.com-records" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.example.medchain.com-records*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-records" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-records*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.medicina-generale-napoli.medchain.com-records" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.medicina-generale-napoli.medchain.com-records*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.patients.medchain.com-records" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.patients.medchain.com-records*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.example.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.example.medchain.com-organization*" -q); do
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
  for container in $(docker ps -a | grep "dev-peer0.medicina-generale-napoli.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.medicina-generale-napoli.medchain.com-organization*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.farmacia-petrone.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.farmacia-petrone.medchain.com-organization*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.laboratorio-analisi-cmo.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.laboratorio-analisi-cmo.medchain.com-organization*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.patients.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.patients.medchain.com-organization*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.example.medchain.com-prescription" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.example.medchain.com-prescription*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.medicina-generale-napoli.medchain.com-prescription" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.medicina-generale-napoli.medchain.com-prescription*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.farmacia-petrone.medchain.com-prescription" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.farmacia-petrone.medchain.com-prescription*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.patients.medchain.com-prescription" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.patients.medchain.com-prescription*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.example.medchain.com-encounter" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.example.medchain.com-encounter*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-encounter" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-encounter*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.medicina-generale-napoli.medchain.com-encounter" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.medicina-generale-napoli.medchain.com-encounter*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.patients.medchain.com-encounter" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.patients.medchain.com-encounter*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done

  printf "Removing generated configs... \U1F5D1 \n"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/crypto-config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"

  printHeadline "Done! Network was purged" "U1F5D1"
}
