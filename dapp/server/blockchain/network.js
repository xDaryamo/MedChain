const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function connectToNetwork(orgConnectionProfile) {
    try {
        // Costruisci il percorso del connection profile
        const ccpPath = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "fablo-target",
            "fabric-config",
            "connection-profiles",
            `connection-profile-${orgConnectionProfile}.json`
        );

        console.log("Resolved CCP path:", ccpPath);

        // Controlla se il file del connection profile esiste
        if (!fs.existsSync(ccpPath)) {
            console.error("Connection profile not found:", ccpPath);
            return;
        }
        
        // Carica il connection profile
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Crea un nuovo wallet. Assicurati che il wallet esista e contenga l'identità richiesta
        const walletPath = path.join(process.cwd(), 'wallet');
        console.log("Resolved Wallet path:", walletPath);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        await enrollUser(orgConnectionProfile).catch(console.error);

        // Crea un'istanza del gateway e connettiti
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin', // Sostituisci con il tuo user ID
            discovery: { enabled: true, asLocalhost: true }
        });

        console.log("Connected to Fabric gateway.");

        return gateway;
        
    } catch (error) {
        console.error(`Failed to connect to Fabric network: ${error}`);
        throw new Error("Failed to connect to Fabric network");
    }
}

const FabricCAServices = require('fabric-ca-client');

async function enrollUser(orgConnectionProfile) {
    // Costruisci il percorso del connection profile
    const ccpPath = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "fablo-target",
        "fabric-config",
        "connection-profiles",
        `connection-profile-${orgConnectionProfile}.json`
    );
    const walletPath = path.join(process.cwd(), 'wallet');

    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Load connection profile
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Print connection profile for debugging
    console.log("Connection Profile:", ccp);

    // Get CA information
    const caInfo = ccp.certificateAuthorities['ca.ospedale-maresca.aslnapoli3.medchain.com'];
    console.log("CA Info:", caInfo);

    // Check if CA information is defined
    if (!caInfo) {
        console.error("CA information not found in connection profile.");
        return;
    }

    const caClient = new FabricCAServices(caInfo.url);

    
    // Enroll admin user
    const enrollment = await caClient.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });

    // Create identity for user
    const identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP', // Update with your MSP ID
        type: 'X.509',
    };

    // Add identity to wallet
    await wallet.put('admin', identity);
}


module.exports = { connectToNetwork };
