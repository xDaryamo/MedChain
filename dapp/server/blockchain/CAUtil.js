const { FabricCAServices } = require("fabric-network");
const path = require("path");
const fs = require("fs");

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
  const adminId = `Admin@${organization.replace(".medchain.com", "")}`;
  const adminSecret = "adminpw";

  try {
    if (!fs.existsSync(walletPath)) {
      fs.mkdirSync(walletPath, { recursive: true });
    }

    if (
      fs.existsSync(path.join(walletPath, "privateKey")) &&
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

    fs.writeFileSync(
      path.join(walletPath, "privateKey"),
      enrollment.key.toBytes()
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
      !fs.existsSync(path.join(walletPath, "privateKey")) &&
      !fs.existsSync(path.join(walletPath, "certificate.pem"))
    ) {
      const adminId = `Admin@${organization.replace(".medchain.com", "")}`;

      if (!fs.existsSync(path.join(walletPath, "..", adminId))) {
        throw new Error(
          `An identity for the admin user ${adminId} does not exist in the wallet`
        );
      }

      const adminIdentity = {
        credentials: {
          certificate: fs.readFileSync(
            path.join(walletPath, "..", adminId, "certificate.pem")
          ),
          privateKey: fs.readFileSync(
            path.join(walletPath, "..", adminId, "privateKey")
          ),
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
        },
        registrar
      );

      const enrollment = await caClient.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret,
      });

      fs.writeFileSync(
        path.join(walletPath, "privateKey"),
        enrollment.key.toBytes()
      );
      fs.writeFileSync(
        path.join(walletPath, "certificate.pem"),
        enrollment.certificate
      );

      console.log(
        `Successfully registered and enrolled user ${userId} and imported it into the wallet`
      );
    } else {
      console.log(
        `An identity for the user ${userId} already exists in the wallet`
      );
    }
  } catch (error) {
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

module.exports = {
  buildCAClient,
  enrollAdmin,
  registerAndEnrollUser,
  getMSPName,
};
