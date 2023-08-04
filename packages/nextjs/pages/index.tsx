import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { Attest } from "~~/components/attestation/Attest";
import { List } from "~~/components/attestation/List";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader title="BuidlGuidl Members" description="Ethereum Attestation Service (EAS)">
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid xl:grid-cols-2 flex-grow " data-theme="exampleUi">
        <Attest />
        <List />
      </div>
    </>
  );
};

export default Home;
