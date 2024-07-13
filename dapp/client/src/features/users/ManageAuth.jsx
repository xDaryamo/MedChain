import GrantedAuth from "./GrantedAuth";
import IncomingAuth from "./IncomingAuth";
import Heading from "../../ui/Heading";
import BackButton from "../../ui/BackButton";
import { useNavigate } from "react-router-dom";

const ManageAuth = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="ml-5 mr-auto mt-10">
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <div className="p-4 md:p-8">
        <div className="mt-8 space-y-12">
          <section>
            <Heading level={2}>Autorizzazioni Concesse</Heading>
            <GrantedAuth />
          </section>
          <section>
            <Heading level={2}>Richieste in Sospeso</Heading>
            <IncomingAuth />
          </section>
        </div>
      </div>
    </>
  );
};

export default ManageAuth;
