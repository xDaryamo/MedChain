const { FabricCAServices, X509WalletMixin } = require('fabric-network');
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

async function enrollAdmin(caClient, wallet, orgMspId, organization) {
    const adminIdWallet = `Admin@${organization}`
    const adminId = 'admin'
    const adminSecret = 'adminpw'


    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(adminIdWallet);
    if (identity) {
        console.log(`An identity for the admin user ${adminIdWallet} already exists in the wallet!`);
        return;
    }
    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await caClient.enroll({ enrollmentID: adminId, enrollmentSecret: adminSecret });

    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: orgMspId,
        type: 'X.509',
    };
    await wallet.put(adminIdWallet, x509Identity);
    console.log(`Successfully enrolled admin user ${adminIdWallet} and imported it into the wallet`);
}

async function registerAndEnrollUser(caClient, wallet, user, userAffiliation, orgMspId, organization) {

    const adminId = `Admin@${organization}`
    const userId = `${user}@${organization}`
    

    // Check if the user already exists
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
        console.log(`An identity for the user ${userId} already exists in the wallet`);
        return;
    }

    // Must use an admin to register a new user
    const adminIdentity = await wallet.get(adminId);
    if (!adminIdentity) {
        console.error('An identity for the admin user "admin" does not exist in the wallet');
        return;
    }

    // Build a User object for the admin
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);


    const adminUser = await provider.getUserContext(adminIdentity, adminId);
    console.log(adminUser)
    
    // Register the new user and enroll the user
    const secret = await caClient.register({
        affiliation: userAffiliation,
        enrollmentID: userId,
        role: 'client'
    }, adminUser);
    const enrollment = await caClient.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret,
    });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: orgMspId,
        type: 'X.509',
    };
    await wallet.put(userId, x509Identity);
    console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
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
