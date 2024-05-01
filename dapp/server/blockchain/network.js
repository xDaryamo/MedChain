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

        // Controlla se il file del connection profile esiste
        if (!fs.existsSync(ccpPath)) {
            console.error("Connection profile not found:", ccpPath);
            return;
        }

        // Carica il connection profile
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Crea un nuovo wallet. Assicurati che il wallet esista e contenga l'identità richiesta
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Crea un'istanza del gateway e connettiti
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'appUser', // Sostituisci con il tuo user ID
            discovery: { enabled: true, asLocalhost: true }
        });

        console.log("Connected to Fabric gateway.");

        // Discolegati dal gateway quando hai finito
        gateway.disconnect();

    } catch (error) {
        console.error(`Failed to connect to Fabric network: ${error}`);
        throw new Error("Failed to connect to Fabric network");
    }
}


module.exports = { connectToNetwork };
