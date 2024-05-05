const { connectToOrg, enrollAdmin } = require("../network");
const path = require("path");

async function addOrganization(org, organizationID, organizationData) {
  const walletPath = path.resolve(__dirname, "..", "wallet");
  await enrollAdmin(org, walletPath);
  const gateway = await connectToOrg(org);
  const network = await gateway.getNetwork("patient-records-channel");
  const contract = network.getContract("organization");

  try {
    await contract.submitTransaction(
      "CreateOrganization",
      organizationID,
      JSON.stringify(organizationData)
    );
    console.log("Organization added successfully.");
  } finally {
    gateway.disconnect();
  }
}

async function getOrganization(org, organizationId) {
  const gateway = await connectToOrg(org);
  const network = await gateway.getNetwork("patient-records-channel");
  const contract = network.getContract("organization");

  try {
    const result = await contract.evaluateTransaction(
      "GetOrganization",
      organizationId
    );
   
    console.log("Raw result from blockchain:", result.toString());

    // Check if the result is empty or nil
    if (!result) {
        console.error("Empty result received from blockchain");
        return null;
    }

    return JSON.parse(result.toString());
  } finally {
    gateway.disconnect();
  }
}

const organization = {
    Identifier: {
        System: "http://example.com/org/id",
        Value: "org1234"
    },
    Active: true,
    Type: {
        Coding: [{
            System: "http://example.com/org/type",
            Code: "hospital",
            Display: "Hospital"
        }],
        Text: "Hospital"
    },
    Name: "Example Hospital",
    Alias: "EH",
    Description: "This is an example hospital.",
    Contact: {
        Name: {
            Text: "John Doe",
            Family: "Doe",
            Given: ["John"],
            Prefix: ["Prefix"],
            Suffix: ["Suffix"]
        },
        Telecom: {
            System: {
                Coding: [{
                    System: "http://hl7.org/fhir/v2/0131",
                    Code: "tel",
                    Display: "Telephone"
                }]
            },
            Value: "123-456-7890",
            Use: {
                Coding: [{
                    System: "http://hl7.org/fhir/v2/0201",
                    Code: "work",
                    Display: "Work"
                }]
            },
            Rank: 1,
            Period: {
                Start: "2023-01-01T00:00:00Z",
                End: "2024-01-01T00:00:00Z"
            }
        },
        Address: {
            Use: {
                Coding: [{
                    System: "http://hl7.org/fhir/v3/AddressUse",
                    Code: "WP",
                    Display: "Work Place"
                }]
            },
            Type: {
                Coding: [{
                    System: "http://hl7.org/fhir/v3/PostalAddressUse",
                    Code: "PHYS",
                    Display: "Physical Visit Address"
                }]
            },
            Text: "123 Main Street",
            Line: "Example Line",
            City: "Example City",
            State: "Example State",
            PostalCode: "12345",
            Country: "United States"
        },
        Organization: {
            Reference: "http://example.com/organizations/456",
            Display: "Another Organization"
        },
        Period: {
            Start: "2023-01-01T00:00:00Z",
            End: "2024-01-01T00:00:00Z"
        }
    },
    PartOf: {
        Reference: "http://example.com/organizations/789",
        Display: "Parent Organization"
    },
    EndPoint: {
        Reference: "http://example.com/endpoints/123",
        Display: "Endpoint"
    },
    Qualification: [{
        Identifier: {
            System: "http://example.com/qualification/id",
            Value: "Q123"
        },
        Code: {
            Coding: [{
                System: "http://example.com/qualification/code",
                Code: "MD",
                Display: "Medical Doctor"
            }],
            Text: "Medical Doctor"
        },
        Status: {
            Coding: [{
                System: "http://example.com/qualification/status",
                Code: "active",
                Display: "Active"
            }],
            Text: "Active"
        },
        Issuer: {
            Reference: "http://example.com/organizations/issuers/456",
            Display: "Issuer Organization"
        }
    }]
};

addOrganization(
  "ospedale-maresca.aslnapoli3.medchain.com",
  "org1234",
  organization
);

(async () => {
  const result = await getOrganization(
    "ospedale-maresca.aslnapoli3.medchain.com",
    "org1234"
  );

  console.log(result);
})();


module.exports = { addOrganization, getOrganization };
