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
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoinTls 'patient-records-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7041' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'patient-records-channel' on  OspedaleMaresca/peer1" "U1F638"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'patient-records-channel' 'OspedaleMarescaMSP' 'peer1.ospedale-maresca.aslnapoli3.medchain.com:7042' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  OspedaleDelMare/peer0" "U1F638"
  docker exec -i cli.ospedale-del-mare.aslnapoli1.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'patient-records-channel' 'OspedaleDelMareMSP' 'peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/msp' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  OspedaleDelMare/peer1" "U1F638"
  docker exec -i cli.ospedale-del-mare.aslnapoli1.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'patient-records-channel' 'OspedaleDelMareMSP' 'peer1.ospedale-del-mare.aslnapoli1.medchain.com:7062' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/msp' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  OspedaleSGiuliano/peer0" "U1F638"
  docker exec -i cli.ospedale-sgiuliano.aslnapoli2.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'patient-records-channel' 'OspedaleSGiulianoMSP' 'peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/msp' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  OspedaleSGiuliano/peer1" "U1F638"
  docker exec -i cli.ospedale-sgiuliano.aslnapoli2.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'patient-records-channel' 'OspedaleSGiulianoMSP' 'peer1.ospedale-sgiuliano.aslnapoli2.medchain.com:7082' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/msp' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  MedicinaGeneraleNapoli/peer0" "U1F638"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'patient-records-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale.napoli.medchain.com:7101' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  MedicinaGeneraleNapoli/peer1" "U1F638"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'patient-records-channel' 'MedicinaGeneraleNapoliMSP' 'peer1.medicina-generale.napoli.medchain.com:7102' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  NeurologiaNapoli/peer0" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'patient-records-channel' 'NeurologiaNapoliMSP' 'peer0.neurologia.napoli.medchain.com:7121' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'crypto/users/Admin@neurologia.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'patient-records-channel' on  NeurologiaNapoli/peer1" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'patient-records-channel' 'NeurologiaNapoliMSP' 'peer1.neurologia.napoli.medchain.com:7122' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'crypto/users/Admin@neurologia.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'prescriptions-channel' on MedicinaGeneraleNapoli/peer0" "U1F63B"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoinTls 'prescriptions-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale.napoli.medchain.com:7101' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'prescriptions-channel' on  MedicinaGeneraleNapoli/peer1" "U1F638"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'prescriptions-channel' 'MedicinaGeneraleNapoliMSP' 'peer1.medicina-generale.napoli.medchain.com:7102' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'prescriptions-channel' on  NeurologiaNapoli/peer0" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'prescriptions-channel' 'NeurologiaNapoliMSP' 'peer0.neurologia.napoli.medchain.com:7121' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'crypto/users/Admin@neurologia.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'prescriptions-channel' on  NeurologiaNapoli/peer1" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'prescriptions-channel' 'NeurologiaNapoliMSP' 'peer1.neurologia.napoli.medchain.com:7122' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'crypto/users/Admin@neurologia.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'prescriptions-channel' on  FarmaciaPetrone/peer0" "U1F638"
  docker exec -i cli.farmacia-petrone.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'prescriptions-channel' 'FarmaciaPetroneMSP' 'peer0.farmacia-petrone.napoli.medchain.com:7141' 'crypto/users/Admin@farmacia-petrone.napoli.medchain.com/msp' 'crypto/users/Admin@farmacia-petrone.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'prescriptions-channel' on  FarmaciaCarbone/peer0" "U1F638"
  docker exec -i cli.farmacia-carbone.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'prescriptions-channel' 'FarmaciaCarboneMSP' 'peer0.farmacia-carbone.napoli.medchain.com:7161' 'crypto/users/Admin@farmacia-carbone.napoli.medchain.com/msp' 'crypto/users/Admin@farmacia-carbone.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'lab-results-channel' on OspedaleMaresca/peer0" "U1F63B"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoinTls 'lab-results-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7041' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'lab-results-channel' on  OspedaleMaresca/peer1" "U1F638"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'lab-results-channel' 'OspedaleMarescaMSP' 'peer1.ospedale-maresca.aslnapoli3.medchain.com:7042' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  MedicinaGeneraleNapoli/peer0" "U1F638"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'lab-results-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale.napoli.medchain.com:7101' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  MedicinaGeneraleNapoli/peer1" "U1F638"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'lab-results-channel' 'MedicinaGeneraleNapoliMSP' 'peer1.medicina-generale.napoli.medchain.com:7102' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  NeurologiaNapoli/peer0" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'lab-results-channel' 'NeurologiaNapoliMSP' 'peer0.neurologia.napoli.medchain.com:7121' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'crypto/users/Admin@neurologia.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  NeurologiaNapoli/peer1" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'lab-results-channel' 'NeurologiaNapoliMSP' 'peer1.neurologia.napoli.medchain.com:7122' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'crypto/users/Admin@neurologia.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  LaboratorioAnalisiCMO/peer0" "U1F638"
  docker exec -i cli.laboratorio-analisi-cmo.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'lab-results-channel' 'LaboratorioAnalisiCMOMSP' 'peer0.laboratorio-analisi-cmo.medchain.com:7181' 'crypto/users/Admin@laboratorio-analisi-cmo.medchain.com/msp' 'crypto/users/Admin@laboratorio-analisi-cmo.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'lab-results-channel' on  LaboratorioAnalisiSDN/peer0" "U1F638"
  docker exec -i cli.laboratorio-analisi-sdn.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'lab-results-channel' 'LaboratorioAnalisiSDNMSP' 'peer0.laboratorio-analisi-sdn.medchain.com:7201' 'crypto/users/Admin@laboratorio-analisi-sdn.medchain.com/msp' 'crypto/users/Admin@laboratorio-analisi-sdn.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'emergency-channel' on OspedaleMaresca/peer0" "U1F63B"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoinTls 'emergency-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7041' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'emergency-channel' on  OspedaleMaresca/peer1" "U1F638"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'emergency-channel' 'OspedaleMarescaMSP' 'peer1.ospedale-maresca.aslnapoli3.medchain.com:7042' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'emergency-channel' on  OspedaleDelMare/peer0" "U1F638"
  docker exec -i cli.ospedale-del-mare.aslnapoli1.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'emergency-channel' 'OspedaleDelMareMSP' 'peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/msp' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'emergency-channel' on  OspedaleDelMare/peer1" "U1F638"
  docker exec -i cli.ospedale-del-mare.aslnapoli1.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'emergency-channel' 'OspedaleDelMareMSP' 'peer1.ospedale-del-mare.aslnapoli1.medchain.com:7062' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/msp' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'emergency-channel' on  OspedaleSGiuliano/peer0" "U1F638"
  docker exec -i cli.ospedale-sgiuliano.aslnapoli2.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'emergency-channel' 'OspedaleSGiulianoMSP' 'peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/msp' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'emergency-channel' on  OspedaleSGiuliano/peer1" "U1F638"
  docker exec -i cli.ospedale-sgiuliano.aslnapoli2.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'emergency-channel' 'OspedaleSGiulianoMSP' 'peer1.ospedale-sgiuliano.aslnapoli2.medchain.com:7082' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/msp' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printHeadline "Creating 'public-health-channel' on OspedaleMaresca/peer0" "U1F63B"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoinTls 'public-health-channel' 'OspedaleMarescaMSP' 'peer0.ospedale-maresca.aslnapoli3.medchain.com:7041' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"

  printItalics "Joining 'public-health-channel' on  OspedaleMaresca/peer1" "U1F638"
  docker exec -i cli.ospedale-maresca.aslnapoli3.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'OspedaleMarescaMSP' 'peer1.ospedale-maresca.aslnapoli3.medchain.com:7042' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/msp' 'crypto/users/Admin@ospedale-maresca.aslnapoli3.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  OspedaleDelMare/peer0" "U1F638"
  docker exec -i cli.ospedale-del-mare.aslnapoli1.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'OspedaleDelMareMSP' 'peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/msp' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  OspedaleDelMare/peer1" "U1F638"
  docker exec -i cli.ospedale-del-mare.aslnapoli1.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'OspedaleDelMareMSP' 'peer1.ospedale-del-mare.aslnapoli1.medchain.com:7062' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/msp' 'crypto/users/Admin@ospedale-del-mare.aslnapoli1.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  OspedaleSGiuliano/peer0" "U1F638"
  docker exec -i cli.ospedale-sgiuliano.aslnapoli2.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'OspedaleSGiulianoMSP' 'peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/msp' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  OspedaleSGiuliano/peer1" "U1F638"
  docker exec -i cli.ospedale-sgiuliano.aslnapoli2.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'OspedaleSGiulianoMSP' 'peer1.ospedale-sgiuliano.aslnapoli2.medchain.com:7082' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/msp' 'crypto/users/Admin@ospedale-sgiuliano.aslnapoli2.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  MedicinaGeneraleNapoli/peer0" "U1F638"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'MedicinaGeneraleNapoliMSP' 'peer0.medicina-generale.napoli.medchain.com:7101' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  MedicinaGeneraleNapoli/peer1" "U1F638"
  docker exec -i cli.medicina-generale.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'MedicinaGeneraleNapoliMSP' 'peer1.medicina-generale.napoli.medchain.com:7102' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/msp' 'crypto/users/Admin@medicina-generale.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  NeurologiaNapoli/peer0" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'NeurologiaNapoliMSP' 'peer0.neurologia.napoli.medchain.com:7121' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'crypto/users/Admin@neurologia.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  NeurologiaNapoli/peer1" "U1F638"
  docker exec -i cli.neurologia.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'NeurologiaNapoliMSP' 'peer1.neurologia.napoli.medchain.com:7122' 'crypto/users/Admin@neurologia.napoli.medchain.com/msp' 'crypto/users/Admin@neurologia.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  FarmaciaPetrone/peer0" "U1F638"
  docker exec -i cli.farmacia-petrone.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'FarmaciaPetroneMSP' 'peer0.farmacia-petrone.napoli.medchain.com:7141' 'crypto/users/Admin@farmacia-petrone.napoli.medchain.com/msp' 'crypto/users/Admin@farmacia-petrone.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  FarmaciaCarbone/peer0" "U1F638"
  docker exec -i cli.farmacia-carbone.napoli.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'FarmaciaCarboneMSP' 'peer0.farmacia-carbone.napoli.medchain.com:7161' 'crypto/users/Admin@farmacia-carbone.napoli.medchain.com/msp' 'crypto/users/Admin@farmacia-carbone.napoli.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  LaboratorioAnalisiCMO/peer0" "U1F638"
  docker exec -i cli.laboratorio-analisi-cmo.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'LaboratorioAnalisiCMOMSP' 'peer0.laboratorio-analisi-cmo.medchain.com:7181' 'crypto/users/Admin@laboratorio-analisi-cmo.medchain.com/msp' 'crypto/users/Admin@laboratorio-analisi-cmo.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
  printItalics "Joining 'public-health-channel' on  LaboratorioAnalisiSDN/peer0" "U1F638"
  docker exec -i cli.laboratorio-analisi-sdn.medchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'public-health-channel' 'LaboratorioAnalisiSDNMSP' 'peer0.laboratorio-analisi-sdn.medchain.com:7201' 'crypto/users/Admin@laboratorio-analisi-sdn.medchain.com/msp' 'crypto/users/Admin@laboratorio-analisi-sdn.medchain.com/tls' 'crypto-orderer/tlsca.orderer.medchain.com-cert.pem' 'orderer0.medchain-orderergroup.orderer.medchain.com:7030';"
}

installChaincodes() {
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go")" ]; then
    local version="1.0"
    printHeadline "Packaging chaincode 'health-data-management'" "U1F60E"
    chaincodeBuild "health-data-management" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go" "12"
    chaincodePackage "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "health-data-management" "$version" "golang" printHeadline "Installing 'health-data-management' for OspedaleMaresca" "U1F60E"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer1.ospedale-maresca.aslnapoli3.medchain.com:7042" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
    printHeadline "Installing 'health-data-management' for OspedaleDelMare" "U1F60E"
    chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer1.ospedale-del-mare.aslnapoli1.medchain.com:7062" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
    printHeadline "Installing 'health-data-management' for OspedaleSGiuliano" "U1F60E"
    chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer1.ospedale-sgiuliano.aslnapoli2.medchain.com:7082" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
    printHeadline "Installing 'health-data-management' for MedicinaGeneraleNapoli" "U1F60E"
    chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer1.medicina-generale.napoli.medchain.com:7102" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
    printHeadline "Installing 'health-data-management' for NeurologiaNapoli" "U1F60E"
    chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer1.neurologia.napoli.medchain.com:7122" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
    printHeadline "Installing 'health-data-management' for FarmaciaPetrone" "U1F60E"
    chaincodeInstall "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com:7141" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeApprove "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com:7141" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
    printHeadline "Installing 'health-data-management' for FarmaciaCarbone" "U1F60E"
    chaincodeInstall "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com:7161" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeApprove "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com:7161" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
    printHeadline "Installing 'health-data-management' for LaboratorioAnalisiCMO" "U1F60E"
    chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7181" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7181" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
    printHeadline "Installing 'health-data-management' for LaboratorioAnalisiSDN" "U1F60E"
    chaincodeInstall "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com:7201" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
    chaincodeApprove "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com:7201" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
    printItalics "Committing chaincode 'health-data-management' on channel 'public-health-channel' as 'OspedaleMaresca'" "U1F618"
    chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.farmacia-petrone.napoli.medchain.com:7141,peer0.farmacia-carbone.napoli.medchain.com:7161,peer0.laboratorio-analisi-cmo.medchain.com:7181,peer0.laboratorio-analisi-sdn.medchain.com:7201" "crypto-peer/peer0.ospedale-maresca.aslnapoli3.medchain.com/tls/ca.crt,crypto-peer/peer0.ospedale-del-mare.aslnapoli1.medchain.com/tls/ca.crt,crypto-peer/peer0.ospedale-sgiuliano.aslnapoli2.medchain.com/tls/ca.crt,crypto-peer/peer0.medicina-generale.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.neurologia.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.farmacia-petrone.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.farmacia-carbone.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.laboratorio-analisi-cmo.medchain.com/tls/ca.crt,crypto-peer/peer0.laboratorio-analisi-sdn.medchain.com/tls/ca.crt" ""
  else
    echo "Warning! Skipping chaincode 'health-data-management' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go'"
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

  if [ "$chaincodeName" = "health-data-management" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go")" ]; then
      printHeadline "Packaging chaincode 'health-data-management'" "U1F60E"
      chaincodeBuild "health-data-management" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go" "12"
      chaincodePackage "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "health-data-management" "$version" "golang" printHeadline "Installing 'health-data-management' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer1.ospedale-maresca.aslnapoli3.medchain.com:7042" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for OspedaleDelMare" "U1F60E"
      chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer1.ospedale-del-mare.aslnapoli1.medchain.com:7062" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for OspedaleSGiuliano" "U1F60E"
      chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer1.ospedale-sgiuliano.aslnapoli2.medchain.com:7082" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer1.medicina-generale.napoli.medchain.com:7102" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for NeurologiaNapoli" "U1F60E"
      chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer1.neurologia.napoli.medchain.com:7122" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for FarmaciaPetrone" "U1F60E"
      chaincodeInstall "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com:7141" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com:7141" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for FarmaciaCarbone" "U1F60E"
      chaincodeInstall "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com:7161" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com:7161" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for LaboratorioAnalisiCMO" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7181" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7181" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for LaboratorioAnalisiSDN" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com:7201" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com:7201" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printItalics "Committing chaincode 'health-data-management' on channel 'public-health-channel' as 'OspedaleMaresca'" "U1F618"
      chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.farmacia-petrone.napoli.medchain.com:7141,peer0.farmacia-carbone.napoli.medchain.com:7161,peer0.laboratorio-analisi-cmo.medchain.com:7181,peer0.laboratorio-analisi-sdn.medchain.com:7201" "crypto-peer/peer0.ospedale-maresca.aslnapoli3.medchain.com/tls/ca.crt,crypto-peer/peer0.ospedale-del-mare.aslnapoli1.medchain.com/tls/ca.crt,crypto-peer/peer0.ospedale-sgiuliano.aslnapoli2.medchain.com/tls/ca.crt,crypto-peer/peer0.medicina-generale.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.neurologia.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.farmacia-petrone.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.farmacia-carbone.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.laboratorio-analisi-cmo.medchain.com/tls/ca.crt,crypto-peer/peer0.laboratorio-analisi-sdn.medchain.com/tls/ca.crt" ""

    else
      echo "Warning! Skipping chaincode 'health-data-management' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go'"
    fi
  fi
}

runDevModeChaincode() {
  local chaincodeName=$1
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "health-data-management" ]; then
    local version="1.0"
    printHeadline "Approving 'health-data-management' for OspedaleMaresca (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "public-health-channel" "health-data-management" "1.0" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'health-data-management' for OspedaleDelMare (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "public-health-channel" "health-data-management" "1.0" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'health-data-management' for OspedaleSGiuliano (dev mode)" "U1F60E"
    chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "public-health-channel" "health-data-management" "1.0" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'health-data-management' for MedicinaGeneraleNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "public-health-channel" "health-data-management" "1.0" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'health-data-management' for NeurologiaNapoli (dev mode)" "U1F60E"
    chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "public-health-channel" "health-data-management" "1.0" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'health-data-management' for FarmaciaPetrone (dev mode)" "U1F60E"
    chaincodeApprove "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com:7141" "public-health-channel" "health-data-management" "1.0" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'health-data-management' for FarmaciaCarbone (dev mode)" "U1F60E"
    chaincodeApprove "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com:7161" "public-health-channel" "health-data-management" "1.0" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'health-data-management' for LaboratorioAnalisiCMO (dev mode)" "U1F60E"
    chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7181" "public-health-channel" "health-data-management" "1.0" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printHeadline "Approving 'health-data-management' for LaboratorioAnalisiSDN (dev mode)" "U1F60E"
    chaincodeApprove "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com:7201" "public-health-channel" "health-data-management" "1.0" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'health-data-management' on channel 'public-health-channel' as 'OspedaleMaresca' (dev mode)" "U1F618"
    chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "public-health-channel" "health-data-management" "1.0" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.farmacia-petrone.napoli.medchain.com:7141,peer0.farmacia-carbone.napoli.medchain.com:7161,peer0.laboratorio-analisi-cmo.medchain.com:7181,peer0.laboratorio-analisi-sdn.medchain.com:7201" "" ""

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

  if [ "$chaincodeName" = "health-data-management" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go")" ]; then
      printHeadline "Packaging chaincode 'health-data-management'" "U1F60E"
      chaincodeBuild "health-data-management" "golang" "$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go" "12"
      chaincodePackage "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "health-data-management" "$version" "golang" printHeadline "Installing 'health-data-management' for OspedaleMaresca" "U1F60E"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeInstall "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer1.ospedale-maresca.aslnapoli3.medchain.com:7042" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for OspedaleDelMare" "U1F60E"
      chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeInstall "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer1.ospedale-del-mare.aslnapoli1.medchain.com:7062" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for OspedaleSGiuliano" "U1F60E"
      chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeInstall "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer1.ospedale-sgiuliano.aslnapoli2.medchain.com:7082" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for MedicinaGeneraleNapoli" "U1F60E"
      chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeInstall "cli.medicina-generale.napoli.medchain.com" "peer1.medicina-generale.napoli.medchain.com:7102" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com:7101" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for NeurologiaNapoli" "U1F60E"
      chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeInstall "cli.neurologia.napoli.medchain.com" "peer1.neurologia.napoli.medchain.com:7122" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com:7121" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for FarmaciaPetrone" "U1F60E"
      chaincodeInstall "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com:7141" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com:7141" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for FarmaciaCarbone" "U1F60E"
      chaincodeInstall "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com:7161" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com:7161" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for LaboratorioAnalisiCMO" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7181" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com:7181" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printHeadline "Installing 'health-data-management' for LaboratorioAnalisiSDN" "U1F60E"
      chaincodeInstall "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com:7201" "health-data-management" "$version" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
      chaincodeApprove "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com:7201" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" ""
      printItalics "Committing chaincode 'health-data-management' on channel 'public-health-channel' as 'OspedaleMaresca'" "U1F618"
      chaincodeCommit "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041" "public-health-channel" "health-data-management" "$version" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "" "false" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem" "peer0.ospedale-maresca.aslnapoli3.medchain.com:7041,peer0.ospedale-del-mare.aslnapoli1.medchain.com:7061,peer0.ospedale-sgiuliano.aslnapoli2.medchain.com:7081,peer0.medicina-generale.napoli.medchain.com:7101,peer0.neurologia.napoli.medchain.com:7121,peer0.farmacia-petrone.napoli.medchain.com:7141,peer0.farmacia-carbone.napoli.medchain.com:7161,peer0.laboratorio-analisi-cmo.medchain.com:7181,peer0.laboratorio-analisi-sdn.medchain.com:7201" "crypto-peer/peer0.ospedale-maresca.aslnapoli3.medchain.com/tls/ca.crt,crypto-peer/peer0.ospedale-del-mare.aslnapoli1.medchain.com/tls/ca.crt,crypto-peer/peer0.ospedale-sgiuliano.aslnapoli2.medchain.com/tls/ca.crt,crypto-peer/peer0.medicina-generale.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.neurologia.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.farmacia-petrone.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.farmacia-carbone.napoli.medchain.com/tls/ca.crt,crypto-peer/peer0.laboratorio-analisi-cmo.medchain.com/tls/ca.crt,crypto-peer/peer0.laboratorio-analisi-sdn.medchain.com/tls/ca.crt" ""

    else
      echo "Warning! Skipping chaincode 'health-data-management' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincodes_go'"
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
  notifyOrgAboutNewChannelTls "patient-records-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "patient-records-channel" "OspedaleDelMareMSP" "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "patient-records-channel" "OspedaleSGiulianoMSP" "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "patient-records-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "patient-records-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "prescriptions-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "prescriptions-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "prescriptions-channel" "FarmaciaPetroneMSP" "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "prescriptions-channel" "FarmaciaCarboneMSP" "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "lab-results-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "lab-results-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "lab-results-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "lab-results-channel" "LaboratorioAnalisiCMOMSP" "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "lab-results-channel" "LaboratorioAnalisiSDNMSP" "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "emergency-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "emergency-channel" "OspedaleDelMareMSP" "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "emergency-channel" "OspedaleSGiulianoMSP" "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "public-health-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com" "peer0.ospedale-maresca.aslnapoli3.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "public-health-channel" "OspedaleDelMareMSP" "cli.ospedale-del-mare.aslnapoli1.medchain.com" "peer0.ospedale-del-mare.aslnapoli1.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "public-health-channel" "OspedaleSGiulianoMSP" "cli.ospedale-sgiuliano.aslnapoli2.medchain.com" "peer0.ospedale-sgiuliano.aslnapoli2.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "public-health-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com" "peer0.medicina-generale.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "public-health-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com" "peer0.neurologia.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "public-health-channel" "FarmaciaPetroneMSP" "cli.farmacia-petrone.napoli.medchain.com" "peer0.farmacia-petrone.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "public-health-channel" "FarmaciaCarboneMSP" "cli.farmacia-carbone.napoli.medchain.com" "peer0.farmacia-carbone.napoli.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "public-health-channel" "LaboratorioAnalisiCMOMSP" "cli.laboratorio-analisi-cmo.medchain.com" "peer0.laboratorio-analisi-cmo.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"
  notifyOrgAboutNewChannelTls "public-health-channel" "LaboratorioAnalisiSDNMSP" "cli.laboratorio-analisi-sdn.medchain.com" "peer0.laboratorio-analisi-sdn.medchain.com" "orderer0.medchain-orderergroup.orderer.medchain.com:7030" "crypto-orderer/tlsca.orderer.medchain.com-cert.pem"

  printHeadline "Deleting new channel config blocks" "U1F52A"
  deleteNewChannelUpdateTx "patient-records-channel" "OspedaleMarescaMSP" "cli.ospedale-maresca.aslnapoli3.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "OspedaleDelMareMSP" "cli.ospedale-del-mare.aslnapoli1.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "OspedaleSGiulianoMSP" "cli.ospedale-sgiuliano.aslnapoli2.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "MedicinaGeneraleNapoliMSP" "cli.medicina-generale.napoli.medchain.com"
  deleteNewChannelUpdateTx "patient-records-channel" "NeurologiaNapoliMSP" "cli.neurologia.napoli.medchain.com"
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
  for container in $(docker ps -a | grep "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-maresca.aslnapoli3.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer1.ospedale-maresca.aslnapoli3.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer1.ospedale-maresca.aslnapoli3.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-del-mare.aslnapoli1.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-del-mare.aslnapoli1.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer1.ospedale-del-mare.aslnapoli1.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer1.ospedale-del-mare.aslnapoli1.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.ospedale-sgiuliano.aslnapoli2.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.ospedale-sgiuliano.aslnapoli2.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer1.ospedale-sgiuliano.aslnapoli2.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer1.ospedale-sgiuliano.aslnapoli2.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.medicina-generale.napoli.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.medicina-generale.napoli.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer1.medicina-generale.napoli.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer1.medicina-generale.napoli.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.neurologia.napoli.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.neurologia.napoli.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer1.neurologia.napoli.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer1.neurologia.napoli.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.farmacia-petrone.napoli.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.farmacia-petrone.napoli.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.farmacia-carbone.napoli.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.farmacia-carbone.napoli.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.laboratorio-analisi-cmo.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.laboratorio-analisi-cmo.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.laboratorio-analisi-sdn.medchain.com-health-data-management" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.laboratorio-analisi-sdn.medchain.com-health-data-management*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done

  printf "Removing generated configs... \U1F5D1 \n"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/crypto-config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"

  printHeadline "Done! Network was purged" "U1F5D1"
}
