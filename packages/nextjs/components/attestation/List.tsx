import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useInterval } from "usehooks-ts";
import { Address } from "~~/components/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";

type TAttestation = {
  id: string;
  attester: string;
  data: string;
  timeCreated: number;
};

export const List = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [attestations, setAttestations] = useState<TAttestation[]>([]);

  const schemaEncoder = new SchemaEncoder("address BuidlGuidlMember");

  const graphUri = "https://optimism.easscan.org/graphql";

  const httpLink = createHttpLink({
    uri: graphUri,
  });

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  const getAttestationsGraphQl = gql`
    query Attestation($where: AttestationWhereInput) {
      attestations(where: $where) {
        attester
        data
        timeCreated
        id
      }
    }
  `;

  const fetchAttestations = async () => {
    console.log("attests");

    const newAttestations = await apolloClient.query({
      query: getAttestationsGraphQl,
      variables: {
        where: { schemaId: { equals: "0x3f28accb30b3437613eb87309d89b85e2f9f515616b603f5af8998e3529edb27" } },
      },
    });

    setIsLoading(false);

    console.log("newAttestations: ", newAttestations);

    setAttestations(newAttestations.data.attestations);
  };

  useEffect(() => {
    (async () => {
      await fetchAttestations();
    })();
  }, []);

  useInterval(async () => {
    await fetchAttestations();
  }, scaffoldConfig.pollingInterval);

  return (
    <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
      <div className="flex justify-center">
        <table className="table table-zebra w-full shadow-lg">
          <thead>
            <tr>
              <th className="bg-primary text-white">UID</th>
              <th className="bg-primary text-white">Attester</th>
              <th className="bg-primary text-white">BuidlGuidl Member</th>
              <th className="bg-primary text-white">Attested at</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              {[...Array(10)].map((_, rowIndex) => (
                <tr key={rowIndex} className="bg-base-200 hover:bg-base-300 transition-colors duration-200 h-12">
                  {[...Array(4)].map((_, colIndex) => (
                    <td className="w-1/4" key={colIndex}>
                      <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {attestations.map(attestation => {
                return (
                  <tr key={attestation.id} className="hover text-sm">
                    <td className="w-1/4">
                      <a
                        href={`https://optimism.easscan.org/attestation/view/${attestation.id}`}
                        title={attestation.id}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {attestation.id.slice(0, 20) + "..."}
                      </a>
                    </td>
                    <td className="w-1/4">
                      <Address address={attestation.attester} size="sm" />
                    </td>
                    <td className="w-1/4">
                      <Address
                        address={schemaEncoder.decodeData(attestation.data)[0].value.value.toString()}
                        size="sm"
                      />
                    </td>
                    <td className="text-right">{attestation.timeCreated}</td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};
