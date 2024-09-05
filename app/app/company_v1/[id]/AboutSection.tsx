import { FaUserTie, FaBuilding, FaGlobe, FaUsers } from "react-icons/fa";
import { CompanyData } from "./page";
import { Details } from "./components";

interface AboutSectionProps {
  companyData: CompanyData;
}

const AboutSection: React.FC<AboutSectionProps> = ({ companyData }) => (
  <Details title="About">
    <div className="px-3 pt-1 pb-2 text-sm text-gray-700">
      <p className="pb-2">{companyData.description}</p>
      <hr></hr>
      <div className="py-3 flex w-full justify-between items-center">
        <div className="flex items-center">
          <FaUserTie className="mr-2" />
          <strong>CEO</strong>
        </div>{" "}
        <a
          href={`https://www.google.com/search?q=${companyData.ceo}&hl=en`}
          target="_blank"
          className="text-blue-500 font-medium"
        >
          {companyData.ceo}
        </a>
      </div>
      <hr></hr>
      <div className="py-3 flex w-full items-center justify-between">
        <div className="flex items-center">
          <FaBuilding className="mr-2" />
          <strong>HEADQUARTERS</strong>
        </div>
        <a
          href={`https://www.google.com/maps/search/${companyData.address}+${companyData.city}`}
          target="_blank"
          className="flex flex-col items-end text-blue-500 font-medium"
        >
          <p>{companyData.address}</p>
          <p>{companyData.city}</p>
        </a>
      </div>
      <hr></hr>
      <div className="py-3 flex w-full justify-between items-center">
        <div className="flex items-center">
          <FaGlobe className="mr-2" />
          <strong>WEBSITE</strong>
        </div>{" "}
        <a
          href={companyData.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-medium"
        >
          {companyData.website}
        </a>
      </div>
      <hr></hr>
      <div className="py-3 flex w-full justify-between items-center">
        <div className="flex items-center">
          <FaUsers className="mr-2" />
          <strong>EMPLOYEES</strong>
        </div>
        <p className="font-medium">{companyData.full_time_employees}</p>
      </div>
    </div>
  </Details>
);

export default AboutSection;
