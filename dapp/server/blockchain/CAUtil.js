const { FabricCAServices } = require("fabric-network");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config();

const encryptionKey = process.env.ENCRYPTION_KEY;

if (!encryptionKey) {
  throw new Error("Encryption key is not defined in the .env file.");
}

function buildCAClient(FabricCAServices, ccp, caHostName) {
  const caInfo = ccp.certificateAuthorities[caHostName];
  let tlsOptions = {};

  if (caInfo.tlsCACerts && caInfo.tlsCACerts.pem) {
    tlsOptions = {
      trustedRoots: caInfo.tlsCACerts.pem,
      verify: true,
    };
  } else {
    tlsOptions = { verify: false };
  }

  return new FabricCAServices(caInfo.url, tlsOptions, caInfo.caName);
}

async function enrollAdmin(caClient, walletPath, orgMspId, organization) {
  const adminId = "admin";
  const adminSecret = "adminpw";

  try {
    if (!fs.existsSync(walletPath)) {
      fs.mkdirSync(walletPath, { recursive: true });
    }

    if (
      fs.existsSync(path.join(walletPath, "privateKey.enc")) &&
      fs.existsSync(path.join(walletPath, "certificate.pem"))
    ) {
      console.log(
        `An identity for the admin user ${adminId} already exists in the wallet!`
      );
      return;
    }

    const enrollment = await caClient.enroll({
      enrollmentID: adminId,
      enrollmentSecret: adminSecret,
    });

    const encryptedPrivateKey = encrypt(enrollment.key.toBytes());

    fs.writeFileSync(
      path.join(walletPath, "privateKey.enc"),
      JSON.stringify(encryptedPrivateKey)
    );
    fs.writeFileSync(
      path.join(walletPath, "certificate.pem"),
      enrollment.certificate
    );

    console.log(
      `Successfully enrolled admin user ${adminId} and imported it into the wallet`
    );
  } catch (error) {
    throw new Error(`Failed to enroll admin: ${error.message}`);
  }
}

async function registerAndEnrollUser(
  caClient,
  wallet,
  walletPath,
  userId,
  userAffiliation,
  orgMspId,
  organization
) {
  try {
    if (!fs.existsSync(walletPath)) {
      fs.mkdirSync(walletPath, { recursive: true });
    }

    if (
      fs.existsSync(path.join(walletPath, "privateKey.enc")) &&
      fs.existsSync(path.join(walletPath, "certificate.pem"))
    ) {
      console.log(
        `An identity for the user ${userId} already exists in the wallet`
      );
      return;
    }

    const adminId = `Admin@${organization.replace(".medchain.com", "")}`;

    if (!fs.existsSync(path.join(walletPath, "..", adminId))) {
      throw new Error(
        `An identity for the admin user ${adminId} does not exist in the wallet`
      );
    }

    const encryptedAdminPrivateKeyData = fs.readFileSync(
      path.join(walletPath, "..", adminId, "privateKey.enc"),
      "utf8"
    );

    const encryptedAdminPrivateKey = JSON.parse(encryptedAdminPrivateKeyData);
    const decryptedAdminPrivateKey = decrypt(encryptedAdminPrivateKey);

    const adminIdentity = {
      credentials: {
        certificate: fs.readFileSync(
          path.join(walletPath, "..", adminId, "certificate.pem")
        ),
        privateKey: decryptedAdminPrivateKey,
      },
      mspId: orgMspId,
      type: "X.509",
    };

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const registrar = await provider.getUserContext(adminIdentity, adminId);

    const secret = await caClient.register(
      {
        affiliation: userAffiliation,
        enrollmentID: userId,
        role: "client",
        attrs: [
          { name: "userId", value: userId, ecert: true },
          { name: "org", value: organization, ecert: true },
        ],
      },
      registrar
    );

    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
    });

    const encryptedPrivateKey = encrypt(enrollment.key.toBytes());

    fs.writeFileSync(
      path.join(walletPath, "privateKey.enc"),
      JSON.stringify(encryptedPrivateKey)
    );
    fs.writeFileSync(
      path.join(walletPath, "certificate.pem"),
      enrollment.certificate
    );

    console.log(
      `Successfully registered and enrolled user ${userId} and imported it into the wallet`
    );
  } catch (error) {
    if (error.message.includes("is already registered")) {
      console.log(`User ${userId} is already registered.`);
      return;
    }
    throw new Error(`Failed to register or enroll user: ${error.message}`);
  }
}

function getMSPName(organization) {
  let subdomain = organization.split(".")[0];
  return (
    subdomain
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("") + "MSP"
  );
}

function encrypt(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv
  );
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
}

function decrypt(encryptedData) {
  const iv = Buffer.from(encryptedData.iv, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedData.encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = {
  buildCAClient,
  enrollAdmin,
  registerAndEnrollUser,
  getMSPName,
  encrypt,
  decrypt,
};
