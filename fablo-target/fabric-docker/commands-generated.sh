#!/usr/bin/env bash

generateArtifacts() {
  printHeadline "Generating basic configs" "U1F913"

  printItalics "Generating crypto material for Orderer" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-orderer.yaml" "peerOrganizations/orderer.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for OspedaleMaresca" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-ospedalemaresca.yaml" "peerOrganizations/ospedale-maresca.aslnapoli3.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for OspedaleDelMare" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-ospedaledelmare.yaml" "peerOrganizations/ospedale-del-mare.aslnapoli1.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for OspedaleSGiuliano" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-ospedalesgiuliano.yaml" "peerOrganizations/ospedale-sgiuliano.aslnapoli2.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for MedicinaGeneraleNapoli" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-medicinageneralenapoli.yaml" "peerOrganizations/medicina-generale.napoli.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for NeurologiaNapoli" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-neurologianapoli.yaml" "peerOrganizations/neurologia.napoli.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for FarmaciaPetrone" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-farmaciapetrone.yaml" "peerOrganizations/farmacia-petrone.napoli.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for FarmaciaCarbone" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-farmaciacarbone.yaml" "peerOrganizations/farmacia-carbone.napoli.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for LaboratorioAnalisiCMO" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-laboratorioanalisicmo.yaml" "peerOrganizations/laboratorio-analisi-cmo.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for LaboratorioAnalisiSDN" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-laboratorioanalisisdn.yaml" "peerOrganizations/laboratorio-analisi-sdn.medchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

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
  printHeadline "Generating config for 'emergency-channel'" "U1F913"
  createChannelTx "emergency-channel" "$FABLO_NETWORK_ROOT/fabric-config" "EmergencyChannel" "$FABLO_NETWORK_ROOT/fabric-config/config"
  printHeadline "Generating config for 'public-health-channel'" "U1F913"
  createChannelTx "public-health-channel" "$FABLO_NETWORK_ROOT/fabric-config" "PublicHealthChannel" "$FABLO_NETWORK_ROOT/fabric-config/config"
}

installChannels() {
  printHeadline "Creating 'patient-records-channel' on OspedaleMaresca/peer0" "U1F63B"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'patient-records-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7041' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'patient-records-channel' on  OspedaleDelMare/peer0" "U1F638"
  docker exec -i cli.ospedale-del-mare.aslnapoli1.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'patient-records-channel' 'OspedaleDelMareMSP' 'peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  OspedaleSGiuliano/peer0" "U1F638"
  docker exec -i cli.ospedale-sgiuliano.aslnapoli2.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'patient-records-channel' 'OspedaleSGiulianoMSP' 'peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  MedicinaGeneraleNapoli/peer0" "U1F638"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'patient-records-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale.napoli.medchain.com:7101' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  NeurologiaNapoli/peer0" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'patient-records-channel' 'NeurologiaNapoliMSP' 'peer0.neurologia.napoli.medchain.com:7121' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  Patients/peer0" "U1F638"
  docker exec -i cli.patients.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'patient-records-channel' 'PatientsMSP' 'peer0.patients.medchain.com:7221' 'crypto/users/Admin@patients.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'prescriptions-channel' on MedicinaGeneraleNapoli/peer0" "U1F63B"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'prescriptions-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale.napoli.medchain.com:7101' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'prescriptions-channel' on  NeurologiaNapoli/peer0" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'prescriptions-channel' 'NeurologiaNapoliMSP' 'peer0.neurologia.napoli.medchain.com:7121' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'prescriptions-channel' on  FarmaciaPetrone/peer0" "U1F638"
  docker exec -i cli.farmacia-petrone.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'prescriptions-channel' 'FarmaciaPetroneMSP' 'peer0.farmacia-petrone.napoli.medchain.com:7141' 'crypto/users/Admin@farmacia-petrone.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'prescriptions-channel' on  FarmaciaCarbone/peer0" "U1F638"
  docker exec -i cli.farmacia-carbone.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'prescriptions-channel' 'FarmaciaCarboneMSP' 'peer0.farmacia-carbone.napoli.medchain.com:7161' 'crypto/users/Admin@farmacia-carbone.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'lab-results-channel' on OspedaleMaresca/peer0" "U1F63B"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'lab-results-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7041' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'lab-results-channel' on  MedicinaGeneraleNapoli/peer0" "U1F638"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'lab-results-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale.napoli.medchain.com:7101' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  NeurologiaNapoli/peer0" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'lab-results-channel' 'NeurologiaNapoliMSP' 'peer0.neurologia.napoli.medchain.com:7121' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  LaboratorioAnalisiCMO/peer0" "U1F638"
  docker exec -i cli.laboratorio-analisi-cmo.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'lab-results-channel' 'LaboratorioAnalisiCMOMSP' 'peer0.laboratorio-analisi-cmo.medchain.com:7181' 'crypto/users/Admin@laboratorio-analisi-cmo.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  LaboratorioAnalisiSDN/peer0" "U1F638"
  docker exec -i cli.laboratorio-analisi-sdn.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'lab-results-channel' 'LaboratorioAnalisiSDNMSP' 'peer0.laboratorio-analisi-sdn.medchain.com:7201' 'crypto/users/Admin@laboratorio-analisi-sdn.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'emergency-channel' on OspedaleMaresca/peer0" "U1F63B"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'emergency-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7041' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'emergency-channel' on  OspedaleDelMare/peer0" "U1F638"
  docker exec -i cli.ospedale-del-mare.aslnapoli1.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'emergency-channel' 'OspedaleDelMareMSP' 'peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'emergency-channel' on  OspedaleSGiuliano/peer0" "U1F638"
  docker exec -i cli.ospedale-sgiuliano.aslnapoli2.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'emergency-channel' 'OspedaleSGiulianoMSP' 'peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'public-health-channel' on OspedaleMaresca/peer0" "U1F63B"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'public-health-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7041' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'public-health-channel' on  OspedaleDelMare/peer0" "U1F638"
  docker exec -i cli.ospedale-del-mare.aslnapoli1.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'public-health-channel' 'OspedaleDelMareMSP' 'peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  OspedaleSGiuliano/peer0" "U1F638"
  docker exec -i cli.ospedale-sgiuliano.aslnapoli2.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'public-health-channel' 'OspedaleSGiulianoMSP' 'peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  MedicinaGeneraleNapoli/peer0" "U1F638"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'public-health-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale.napoli.medchain.com:7101' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  NeurologiaNapoli/peer0" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'public-health-channel' 'NeurologiaNapoliMSP' 'peer0.neurologia.napoli.medchain.com:7121' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  FarmaciaPetrone/peer0" "U1F638"
  docker exec -i cli.farmacia-petrone.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'public-health-channel' 'FarmaciaPetroneMSP' 'peer0.farmacia-petrone.napoli.medchain.com:7141' 'crypto/users/Admin@farmacia-petrone.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  FarmaciaCarbone/peer0" "U1F638"
  docker exec -i cli.farmacia-carbone.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'public-health-channel' 'FarmaciaCarboneMSP' 'peer0.farmacia-carbone.napoli.medchain.com:7161' 'crypto/users/Admin@farmacia-carbone.napoli.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  LaboratorioAnalisiCMO/peer0" "U1F638"
  docker exec -i cli.laboratorio-analisi-cmo.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'public-health-channel' 'LaboratorioAnalisiCMOMSP' 'peer0.laboratorio-analisi-cmo.medchain.com:7181' 'crypto/users/Admin@laboratorio-analisi-cmo.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  LaboratorioAnalisiSDN/peer0" "U1F638"
  docker exec -i cli.laboratorio-analisi-sdn.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'public-health-channel' 'LaboratorioAnalisiSDNMSP' 'peer0.laboratorio-analisi-sdn.medchain.com:7201' 'crypto/users/Admin@laboratorio-analisi-sdn.medchain.com/msp' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
}

installChaincodes() {
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient")" ]; then
    local version="0.1"
    printHeadline "Packaging chaincode 'patient'" "U1F60E"
    chaincodeBuild "patient" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/patient" "16"
    chaincodePackage "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient" "$version" "golang" printHeadline "Installing 'patient' for OspedaleMaresca" "U1F60E"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient" "$version" ""
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'patient' for OspedaleDelMare" "U1F60E"
    chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient" "$version" ""
    chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'patient' for OspedaleSGiuliano" "U1F60E"
    chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient" "$version" ""
    chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'patient' for MedicinaGeneraleNapoli" "U1F60E"
    chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient" "$version" ""
    chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'patient' for NeurologiaNapoli" "U1F60E"
    chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient" "$version" ""
    chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'patient' for Patients" "U1F60E"
    chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient" "$version" ""
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'patient' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
    chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.patients.medchain.com:7221" "" ""
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
    printHeadline "Installing 'organization' for OspedaleDelMare" "U1F60E"
    chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "organization" "$version" ""
    chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'organization' for OspedaleSGiuliano" "U1F60E"
    chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "organization" "$version" ""
    chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'organization' for MedicinaGeneraleNapoli" "U1F60E"
    chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "organization" "$version" ""
    chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'organization' for NeurologiaNapoli" "U1F60E"
    chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "organization" "$version" ""
    chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Installing 'organization' for Patients" "U1F60E"
    chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "organization" "$version" ""
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'organization' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
    chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.patients.medchain.com:7221" "" ""
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
      printHeadline "Installing 'patient' for OspedaleDelMare" "U1F60E"
      chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient" "$version" ""
      chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for OspedaleSGiuliano" "U1F60E"
      chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient" "$version" ""
      chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient" "$version" ""
      chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for NeurologiaNapoli" "U1F60E"
      chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient" "$version" ""
      chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'patient' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
      chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.patients.medchain.com:7221" "" ""

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
      printHeadline "Installing 'organization' for OspedaleDelMare" "U1F60E"
      chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "organization" "$version" ""
      chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for OspedaleSGiuliano" "U1F60E"
      chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "organization" "$version" ""
      chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "organization" "$version" ""
      chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for NeurologiaNapoli" "U1F60E"
      chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "organization" "$version" ""
      chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "organization" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'organization' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
      chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.patients.medchain.com:7221" "" ""

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
    printHeadline "Approving 'patient' for OspedaleDelMare (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient-records-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'patient' for OspedaleSGiuliano (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient-records-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'patient' for MedicinaGeneraleNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient-records-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'patient' for NeurologiaNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient-records-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'patient' for Patients (dev mode)" "U1F60E"
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient-records-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'patient' on channel 'patient-records-channel' as 'OspedaleMaresca' (dev mode)" "U1F618"
    chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.patients.medchain.com:7221" "" ""

  fi
  if [ "$chaincodeName" = "organization" ]; then
    local version="0.1"
    printHeadline "Approving 'organization' for OspedaleMaresca (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'organization' for OspedaleDelMare (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient-records-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'organization' for OspedaleSGiuliano (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient-records-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'organization' for MedicinaGeneraleNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient-records-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'organization' for NeurologiaNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient-records-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'organization' for Patients (dev mode)" "U1F60E"
    chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient-records-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'organization' on channel 'patient-records-channel' as 'OspedaleMaresca' (dev mode)" "U1F618"
    chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "0.1" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.patients.medchain.com:7221" "" ""

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
      printHeadline "Installing 'patient' for OspedaleDelMare" "U1F60E"
      chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient" "$version" ""
      chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for OspedaleSGiuliano" "U1F60E"
      chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient" "$version" ""
      chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient" "$version" ""
      chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for NeurologiaNapoli" "U1F60E"
      chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient" "$version" ""
      chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'patient' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'patient' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
      chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "patient" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.patients.medchain.com:7221" "" ""

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
      printHeadline "Installing 'organization' for OspedaleDelMare" "U1F60E"
      chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "organization" "$version" ""
      chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for OspedaleSGiuliano" "U1F60E"
      chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "organization" "$version" ""
      chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "organization" "$version" ""
      chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for NeurologiaNapoli" "U1F60E"
      chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "organization" "$version" ""
      chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printHeadline "Installing 'organization' for Patients" "U1F60E"
      chaincodeInstall "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "organization" "$version" ""
      chaincodeApprove "cli.patients.medchain.com" "peer0.patients.medchain.com:7221" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'organization' on channel 'patient-records-channel' as 'OspedaleMaresca'" "U1F618"
      chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "patient-records-channel" "organization" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.patients.medchain.com:7221" "" ""

    else
      echo "Warning! Skipping chaincode 'organization' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go/organization'"
    fi
  fi
}

notifyOrgsAboutChannels() {
  printHeadline "Creating new channel config blocks" "U1F537"
  createNewChannelUpdateTx "patient-records-channel" "OspedaleMarescaMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "patient-records-channel" "OspedaleDelMareMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "patient-records-channel" "OspedaleSGiulianoMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "patient-records-channel" "MedicinaGeneraleNapoliMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "patient-records-channel" "NeurologiaNapoliMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "patient-records-channel" "PatientsMSP" "PatientRecordsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "prescriptions-channel" "MedicinaGeneraleNapoliMSP" "PrescriptionsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "prescriptions-channel" "NeurologiaNapoliMSP" "PrescriptionsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "prescriptions-channel" "FarmaciaPetroneMSP" "PrescriptionsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "prescriptions-channel" "FarmaciaCarboneMSP" "PrescriptionsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "lab-results-channel" "OspedaleMarescaMSP" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "lab-results-channel" "MedicinaGeneraleNapoliMSP" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "lab-results-channel" "NeurologiaNapoliMSP" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "lab-results-channel" "LaboratorioAnalisiCMOMSP" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "lab-results-channel" "LaboratorioAnalisiSDNMSP" "LabResultsChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "emergency-channel" "OspedaleMarescaMSP" "EmergencyChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "emergency-channel" "OspedaleDelMareMSP" "EmergencyChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "emergency-channel" "OspedaleSGiulianoMSP" "EmergencyChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "public-health-channel" "OspedaleMarescaMSP" "PublicHealthChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "public-health-channel" "OspedaleDelMareMSP" "PublicHealthChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "public-health-channel" "OspedaleSGiulianoMSP" "PublicHealthChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "public-health-channel" "MedicinaGeneraleNapoliMSP" "PublicHealthChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "public-health-channel" "NeurologiaNapoliMSP" "PublicHealthChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "public-health-channel" "FarmaciaPetroneMSP" "PublicHealthChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "public-health-channel" "FarmaciaCarboneMSP" "PublicHealthChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "public-health-channel" "LaboratorioAnalisiCMOMSP" "PublicHealthChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "public-health-channel" "LaboratorioAnalisiSDNMSP" "PublicHealthChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"

  printHeadline "Notyfing orgs about channels" "U1F4E2"
  notifyOrgAboutNewChannel "patient-records-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "patient-records-channel" "OspedaleDelMareMSP" "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "patient-records-channel" "OspedaleSGiulianoMSP" "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "patient-records-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "patient-records-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "patient-records-channel" "PatientsMSP" "cli.patients.medchain.com" "peer0.patients.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "prescriptions-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "prescriptions-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "prescriptions-channel" "FarmaciaPetroneMSP" "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "prescriptions-channel" "FarmaciaCarboneMSP" "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "lab-results-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "lab-results-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "lab-results-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "lab-results-channel" "LaboratorioAnalisiCMOMSP" "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "lab-results-channel" "LaboratorioAnalisiSDNMSP" "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "emergency-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "emergency-channel" "OspedaleDelMareMSP" "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "emergency-channel" "OspedaleSGiulianoMSP" "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "public-health-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "public-health-channel" "OspedaleDelMareMSP" "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "public-health-channel" "OspedaleSGiulianoMSP" "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "public-health-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "public-health-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "public-health-channel" "FarmaciaPetroneMSP" "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "public-health-channel" "FarmaciaCarboneMSP" "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "public-health-channel" "LaboratorioAnalisiCMOMSP" "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"
  notifyOrgAboutNewChannel "public-health-channel" "LaboratorioAnalisiSDNMSP" "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030"

  printHeadline "Deleting new channel config blocks" "U1F52A"
  deleteNewChannelUpdateTx "patient-records-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "OspedaleDelMareMSP" "cli.ospedale-del-mare.aslnapoli1.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "OspedaleSGiulianoMSP" "cli.ospedale-sgiuliano.aslnapoli2.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "PatientsMSP" "cli.patients.medchain.com"
  deleteNewChannelUpdateTx "prescriptions-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com"
  deleteNewChannelUpdateTx "prescriptions-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com"
  deleteNewChannelUpdateTx "prescriptions-channel" "FarmaciaPetroneMSP" "cli.farmacia-petrone.napoli.medchain.com"
  deleteNewChannelUpdateTx "prescriptions-channel" "FarmaciaCarboneMSP" "cli.farmacia-carbone.napoli.medchain.com"
  deleteNewChannelUpdateTx "lab-results-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com"
  deleteNewChannelUpdateTx "lab-results-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com"
  deleteNewChannelUpdateTx "lab-results-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com"
  deleteNewChannelUpdateTx "lab-results-channel" "LaboratorioAnalisiCMOMSP" "cli.laboratorio-analisi-cmo.medchain.com"
  deleteNewChannelUpdateTx "lab-results-channel" "LaboratorioAnalisiSDNMSP" "cli.laboratorio-analisi-sdn.medchain.com"
  deleteNewChannelUpdateTx "emergency-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com"
  deleteNewChannelUpdateTx "emergency-channel" "OspedaleDelMareMSP" "cli.ospedale-del-mare.aslnapoli1.medchain.com"
  deleteNewChannelUpdateTx "emergency-channel" "OspedaleSGiulianoMSP" "cli.ospedale-sgiuliano.aslnapoli2.medchain.com"
  deleteNewChannelUpdateTx "public-health-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com"
  deleteNewChannelUpdateTx "public-health-channel" "OspedaleDelMareMSP" "cli.ospedale-del-mare.aslnapoli1.medchain.com"
  deleteNewChannelUpdateTx "public-health-channel" "OspedaleSGiulianoMSP" "cli.ospedale-sgiuliano.aslnapoli2.medchain.com"
  deleteNewChannelUpdateTx "public-health-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com"
  deleteNewChannelUpdateTx "public-health-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com"
  deleteNewChannelUpdateTx "public-health-channel" "FarmaciaPetroneMSP" "cli.farmacia-petrone.napoli.medchain.com"
  deleteNewChannelUpdateTx "public-health-channel" "FarmaciaCarboneMSP" "cli.farmacia-carbone.napoli.medchain.com"
  deleteNewChannelUpdateTx "public-health-channel" "LaboratorioAnalisiCMOMSP" "cli.laboratorio-analisi-cmo.medchain.com"
  deleteNewChannelUpdateTx "public-health-channel" "LaboratorioAnalisiSDNMSP" "cli.laboratorio-analisi-sdn.medchain.com"
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
  for container in $(docker ps -a | grep "dev-peer0.ospedale-del-mare.aslnapoli1.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-del-mare.aslnapoli1.medchain.com-patient*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-sgiuliano.aslnapoli2.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-sgiuliano.aslnapoli2.medchain.com-patient*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.medicina-generale.napoli.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.medicina-generale.napoli.medchain.com-patient*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.neurologia.napoli.medchain.com-patient" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.neurologia.napoli.medchain.com-patient*" -q); do
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
  for container in $(docker ps -a | grep "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-organization*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-del-mare.aslnapoli1.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-del-mare.aslnapoli1.medchain.com-organization*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-sgiuliano.aslnapoli2.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-sgiuliano.aslnapoli2.medchain.com-organization*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.medicina-generale.napoli.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.medicina-generale.napoli.medchain.com-organization*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.neurologia.napoli.medchain.com-organization" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.neurologia.napoli.medchain.com-organization*" -q); do
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

  printf "Removing generated configs... \U1F5D1 \n"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/crypto-config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"

  printHeadline "Done! Network was purged" "U1F5D1"
}
