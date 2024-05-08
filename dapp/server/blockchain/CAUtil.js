const { FabricCAServices, X509WalletMixin} = require('fabric-network');
const path = require('path');
const fs = require('fs');

function buildCAClient(FabricCAServices, ccp, caHostName) {
    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities[caHostName]; // specific CA information
    let tlsOptions = {};

    // Check if TLS is enabled in the connection profile and configure accordingly
    if (caInfo.tlsCACerts && caInfo.tlsCACerts.pem) {
        tlsOptions = {
            trustedRoots: caInfo.tlsCACerts.pem,
            verify: true
        };
    } else {
        // If no TLS, then do not verify the certificates
        tlsOptions = {
            verify: false
        };
    }
    const caClient = new FabricCAServices(caInfo.url, tlsOptions, caInfo.caName);

    console.log(`Built a CA Client named ${caInfo.caName}`);
    return caClient;
}

async function enrollAdmin(caClient, parentWalletPath, orgMspId, organization) {
    const orgNameWithoutSuffix = organization.replace('.medchain.com', '');
    const adminIdWallet = `Admin@${orgNameWithoutSuffix}`;
    const adminId = 'admin';
    const adminSecret = 'adminpw';

    if (!fs.existsSync(parentWalletPath)) {
        fs.mkdirSync(parentWalletPath, { recursive: true });
    }

    if (fs.existsSync(path.join(parentWalletPath, 'privateKey')) && fs.existsSync(path.join(parentWalletPath, 'certificate.pem'))) {
        console.log(`An identity for the admin user ${adminIdWallet} already exists in the wallet!`);
        return;
    }

    const enrollment = await caClient.enroll({ enrollmentID: adminId, enrollmentSecret: adminSecret });

    fs.writeFileSync(path.join(parentWalletPath, 'privateKey'), enrollment.key.toBytes());
    fs.writeFileSync(path.join(parentWalletPath, 'certificate.pem'), enrollment.certificate);

    console.log(`Successfully enrolled admin user ${adminIdWallet} and imported it into the wallet`);
}

async function registerAndEnrollUser(caClient, wallet, walletPath, userId, userAffiliation, orgMspId, organization) {
    if (!fs.existsSync(walletPath)) {
        fs.mkdirSync(walletPath, { recursive: true });
    }

    if (!fs.existsSync(path.join(walletPath, 'privateKey')) && !fs.existsSync(path.join(walletPath, 'certificate.pem'))) {
        const adminId = `Admin@${organization.replace('.medchain.com', '')}`;
        if (!fs.existsSync(path.join(walletPath, '..', adminId))) {
            console.error(`An identity for the admin user ${adminId} does not exist in the wallet`);
            return;
        }

        const adminIdentity = {
            credentials: {
                certificate: fs.readFileSync(path.join(walletPath, '..', adminId, 'certificate.pem')),
                privateKey: fs.readFileSync(path.join(walletPath, '..', adminId, 'privateKey')),
            },
            mspId: orgMspId,
            type: 'X.509',
        };


        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const registrar = await provider.getUserContext(adminIdentity, adminId);

        const secret = await caClient.register({
            affiliation: userAffiliation,
            enrollmentID: userId,
            role: 'client'
        }, registrar);

        const enrollment = await caClient.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret,
        });

        fs.writeFileSync(path.join(walletPath, 'privateKey'), enrollment.key.toBytes());
        fs.writeFileSync(path.join(walletPath, 'certificate.pem'), enrollment.certificate);

        console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
    } else {
        console.log(`An identity for the user ${userId} already exists in the wallet`);
    }
}

function getMSPName(organization) {
    let subdomain = organization.split('.')[0];
    return subdomain.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('') + "MSP";
}

module.exports = {
    buildCAClient,
    enrollAdmin,
    registerAndEnrollUser,
    getMSPName
};
