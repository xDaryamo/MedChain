const { Gateway, Wallets, X509Identity } = require('fabric-network');
const { buildCAClient, registerAndEnrollUser, enrollAdmin, getMSPName  } = require('./CAUtil.js'); // Assicurati di creare questo modulo
const FabricCAServices = require('fabric-ca-client');
const path = require('path')
const fs = require('fs')


class FabricNetwork {
    constructor() {
        this.gateway = new Gateway();
    }

    // Initialize the connection to the blockchain network
    async init(userId, organization, channelName, chaincodeName) {
        try {

            if (!userId || !organization || !channelName || !chaincodeName) {
                throw new Error('Missing required parameters for initialization');
            }

            // Load the connection profile; this is network specific
            const profileName = organization.split(".")[0].replace(/-/g, "");
            const ccpPath = path.resolve(
              __dirname,
              "..",
              "..",
              "..",
              "fablo-target",
              "fabric-config",
              "connection-profiles",
              `connection-profile-${profileName}.json`
            );

            if (!fs.existsSync(ccpPath)) {
                console.error(`Connection profile for ${organization} not found.`);
                return;
            }
          
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Setup the wallet to hold the credentials of the application user
            const walletPath = path.join(__dirname, 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);

            // Setup gateway connection options; identity and wallet
            let connectionOptions = {
                wallet,
                identity: userId,
                discovery: { enabled: true, asLocalhost: true } 
            };

            // Connect to gateway using application specified parameters
            await this.gateway.connect(ccp, connectionOptions);

            // Access the network and the smart contract
            this.network = await this.gateway.getNetwork(channelName);
            this.contract = this.network.getContract(chaincodeName);

            console.log(`Successfully connected to Fabric network for organization: ${organization}`);
        } catch (error) {
            console.error(`Error initializing Fabric network: ${error}`);
            throw error;
        }
    }


    async registerAndEnrollUser(userId, userAffiliation, organization) {
        const walletPath = path.join(__dirname, 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        const profileName = organization.split(".")[0].replace(/-/g, "");
        const caName = `ca.${organization}`;
        const MSPName = getMSPName(organization)

        const ccpPath = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "fablo-target",
            "fabric-config",
            "connection-profiles",
            `connection-profile-${profileName}.json`
        );

        if (!fs.existsSync(ccpPath)) {
            console.error(`Connection profile for ${organization} not found.`);
            return;
        }
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        
        const caClient = buildCAClient(FabricCAServices, ccp, caName); 
        
        // Presume che un admin sia già arruolato e presente nel wallet
        await registerAndEnrollUser(caClient, wallet, userId, userAffiliation, MSPName, organization);
    }

    async enrollAdmin(organization) {
        const walletPath = path.join(__dirname, 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        const profileName = organization.split(".")[0].replace(/-/g, "");
        const caName = `ca.${organization}`;
        const MSPName = getMSPName(organization)

        const ccpPath = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "fablo-target",
            "fabric-config",
            "connection-profiles",
            `connection-profile-${profileName}.json`
        );

        if (!fs.existsSync(ccpPath)) {
            console.error(`Connection profile for ${organization} not found.`);
            return;
        }
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        
        const caClient = buildCAClient(FabricCAServices, ccp, caName); 
        
        await enrollAdmin(caClient, wallet, MSPName, organization)
    }

    


    // Evaluate a transaction (query the ledger)
    async evaluateTransaction(functionName, ...args) {
        try {
            const response = await this.contract.evaluateTransaction(functionName, ...args);
           
            // Convert Buffer to string using the utf8 encoding
            if (Buffer.isBuffer(response)) {
                return response.toString('utf8');
            }

            return response;
            
          } catch (error) {
            if (error.chaincodeError) { 
              console.error(`Chaincode error: ${error.message}`); 
            } else {
              console.error(`Error evaluating transaction: ${error}`);
            }
            throw error;
          }
    }

    // Submit a transaction to the ledger
    async submitTransaction(functionName, ...args) {
        try {
            const response = await this.contract.submitTransaction(functionName, ...args);
           
            if (typeof response === 'string') {
              return response;
            } else {
              return JSON.stringify(response);
            }
          } catch (error) {
            if (error.chaincodeError) { 
              console.error(`Chaincode error: ${error.message}`); 
            } else {
              console.error(`Error submitting transaction: ${error}`);
            }
            throw error;
          }
    }

    // Disconnect from the gateway
    disconnect() {
        this.gateway.disconnect();
    }
}

module.exports = FabricNetwork;

