const { Gateway, Wallets } = require("fabric-network");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
  getMSPName,
  decrypt,
} = require("./CAUtil.js");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

class FabricNetwork {
  constructor() {
    this.gateway = new Gateway();
  }

  async init(userId, organization, channelName, chaincodeName) {
    this.validateParameters(userId, organization, channelName, chaincodeName);
    const ccp = this.loadConnectionProfile(organization);
    const wallet = await this.configureWallet(userId, organization, ccp);
    await this.connectToGateway(
      ccp,
      wallet,
      userId,
      channelName,
      chaincodeName,
      organization
    );
  }

  validateParameters(userId, organization, channelName, chaincodeName) {
    if (!userId || !organization || !channelName || !chaincodeName) {
      throw new Error("Missing required parameters for initialization");
    }
  }

  loadConnectionProfile(organization) {
    const ccpPath = this.getCCPPath(organization);
    if (!fs.existsSync(ccpPath)) {
      throw new Error(`Connection profile for ${organization} not found.`);
    }
    return JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  }

  getCCPPath(organization) {
    const profileName = organization.split(".")[0].replace(/-/g, "");
    return path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "fablo-target",
      "fabric-config",
      "connection-profiles",
      `connection-profile-${profileName}.json`
    );
  }

  async configureWallet(userId, organization, ccp) {
    const walletPath = path.join(__dirname, "wallet", organization, userId);
    const wallet = await Wallets.newInMemoryWallet(walletPath);
    const identity = await this.loadIdentity(
      walletPath,
      getMSPName(organization)
    );
    await wallet.put(userId, identity);
    console.log(walletPath);
    return wallet;
  }

  async loadIdentity(walletPath, MSPName) {
    const certPath = path.join(walletPath, "certificate.pem");
    const keyPath = path.join(walletPath, "privateKey.enc");
    const certificate = fs.readFileSync(certPath, "utf8");

    const encryptedPrivateKeyData = fs.readFileSync(keyPath, "utf8");
    const encryptedPrivateKey = JSON.parse(encryptedPrivateKeyData);
    const privateKey = decrypt(encryptedPrivateKey);

    return {
      credentials: { certificate, privateKey },
      mspId: MSPName,
      type: "X.509",
    };
  }

  async connectToGateway(
    ccp,
    wallet,
    userId,
    channelName,
    chaincodeName,
    organization
  ) {
    const connectionOptions = {
      wallet,
      identity: userId,
      discovery: { enabled: true, asLocalhost: true },
    };
    await this.gateway.connect(ccp, connectionOptions);
    this.network = await this.gateway.getNetwork(channelName);
    this.contract = this.network.getContract(chaincodeName);
    console.log(
      `Successfully connected to Fabric network for organization: ${organization}`
    );
  }

  async registerAndEnrollUser(userAffiliation, organization) {
    const userId = uuidv4();
    const walletPath = path.join(__dirname, "wallet", organization, userId);
    const ccp = this.loadConnectionProfile(organization);
    const caClient = buildCAClient(FabricCAServices, ccp, `ca.${organization}`);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    await registerAndEnrollUser(
      caClient,
      wallet,
      walletPath,
      userId,
      userAffiliation,
      getMSPName(organization),
      organization
    );
    return userId;
  }

  async enrollAdmin(organization) {
    const adminId = `Admin@${organization.replace(".medchain.com", "")}`;
    const walletPath = path.join(__dirname, "wallet", organization, adminId);
    const ccp = this.loadConnectionProfile(organization);
    const caClient = buildCAClient(FabricCAServices, ccp, `ca.${organization}`);
    await enrollAdmin(
      caClient,
      walletPath,
      getMSPName(organization),
      organization
    );
  }

  async evaluateTransaction(functionName, ...args) {
    try {
      const response = await this.contract.evaluateTransaction(
        functionName,
        ...args
      );
      return response.toString();
    } catch (error) {
      console.error(`Error evaluating transaction: ${error}`);
      throw error;
    }
  }

  async submitTransaction(functionName, ...args) {
    try {
      const response = await this.contract.submitTransaction(
        functionName,
        ...args
      );
      return response.toString();
    } catch (error) {
      console.error(`Error submitting transaction: ${error}`);
      throw error;
    }
  }

  disconnect() {
    this.gateway.disconnect();
  }
}

module.exports = FabricNetwork;
