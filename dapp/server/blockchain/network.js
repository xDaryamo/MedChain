const { Gateway, Wallets, X509Identity } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const path = require("path");


function domainToCamelCase(domain) {
  let subdomain = domain.split('.')[0];
  return subdomain.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('');
}


// Funzione per connettersi a una specifica organizzazione
async function connectToOrg(orgName) {
  const profileName = orgName.split(".")[0].replace(/-/g, "");
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
    console.error(`Connection profile for ${orgName} not found.`);
    return;
  }

  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const walletPath = path.resolve(__dirname, "wallet");
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const identity = await wallet.get(`Admin@${orgName}`);

  if (!identity) {
    console.error(`No identity found for Admin@${orgName}.`);
    return;
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: `Admin@${orgName}`,
    discovery: { enabled: true, asLocalhost: true },
  });

  console.log(`Connected to ${orgName}.`);
  return gateway;
}

// Funzione per iscrivere gli amministratori
async function enrollAdmin(org, walletPath) {
  const adminId = `Admin@${org}`; 
  const enrollmentID = "admin"; 
  const adminSecret = "adminpw"; 
  const mspId = domainToCamelCase(org) + "MSP";
  const caName = `ca.${org}`;
  const profileName = org.split(".")[0].replace(/-/g, "");
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
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const caURL = ccp.certificateAuthorities[caName].url;
  const ca = new FabricCAServices(caURL);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  try {
    const adminExists = await wallet.get(adminId);
    if (adminExists) {
      console.log(`Admin identity ${adminId} already exists in the wallet`);
      return;
    }
    console.log(`Enrolling ${enrollmentID} with CA at URL: ${caURL}`);
    const enrollment = await ca.enroll({
      enrollmentID: enrollmentID,
      enrollmentSecret: adminSecret,
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: mspId,
      type: "X.509",
    };
    await wallet.put(adminId, x509Identity);
    console.log(
      `Successfully enrolled admin and imported identity ${adminId} into the wallet`
    );
  } catch (error) {
    console.error(`Failed to enroll admin ${adminId}: ${error}`);
    throw new Error(`Failed to enroll admin ${adminId}: ${error}`);
  }
}

// Funzione per creare e registrare un nuovo utente e aggiungerlo al wallet
// async function createUser(orgName, userId, userSecret, affiliation, role) {
//   const walletPath = path.resolve(__dirname, "wallet");
//   const wallet = await Wallets.newFileSystemWallet(walletPath);

//   const userExists = await wallet.get(userId);
//   if (userExists) {
//     console.log(`User ${userId} already exists in the wallet.`);
//     return;
//   }

//   const profileName = orgName.split(".")[0].replace(/-/g, "");
//   const ccpPath = path.resolve(
//     __dirname,
//     "..",
//     "..",
//     "..",
//     "fablo-target",
//     "fabric-config",
//     "connection-profiles",
//     `connection-profile-${profileName}.json`
//   );
//   const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
//   const caURL = ccp.certificateAuthorities[`ca.${orgName}`].url;
//   const ca = new FabricCAServices(caURL);

//   const adminIdentity = await wallet.get(`Admin@${orgName}`);
//   if (!adminIdentity) {
//     console.error(`Admin identity not found in the wallet for ${orgName}.`);
//     return;
//   }

//   const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
//   const admin = await provider.getUserContext(
//     adminIdentity,
//     `Admin@${orgName}`
//   );

//   // Registra il nuovo utente
//   try {
//     const secret = await ca.register(
//       {
//         affiliation: affiliation,
//         enrollmentID: userId,
//         role: role,
//         enrollmentSecret: userSecret,
//       },
//       admin
//     );

//     // Iscrivi il nuovo utente
//     const enrollment = await ca.enroll({
//       enrollmentID: userId,
//       enrollmentSecret: secret,
//     });

//     const userIdentity = {
//       credentials: {
//         certificate: enrollment.certificate,
//         privateKey: enrollment.key.toBytes(),
//       },
//       mspId: `${orgName}MSP`,
//       type: "X.509",
//     };

//     // Salva l'identità nel wallet
//     await wallet.put(userId, userIdentity);
//     console.log(
//       `Successfully enrolled and added user ${userId} to the wallet.`
//     );
//   } catch (error) {
//     console.error(`Failed to register and enroll user ${userId}: ${error}`);
//     throw new Error(`Failed to register and enroll user ${userId}: ${error}`);
//   }
// }

// Inizializzazione di tutti gli admin all'avvio dell'applicazione
async function initializeAdmins() {
  const orgs = [
    "farmacia-carbone.napoli.medchain.com",
    "ospedale-del-mare.aslnapoli1.medchain.com",
    "ospedale-maresca.aslnapoli3.medchain.com",
  ];
  const walletPath = path.resolve(__dirname, "wallet");
  for (let org of orgs) {
    await enrollAdmin(org, walletPath);
  }
}

// initializeAdmins();
// createUser("farmacia-carbone.napoli.medchain.com", "user2", "userpw", "*" )

module.exports = { connectToOrg, enrollAdmin, initializeAdmins };
