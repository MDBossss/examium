import { DocumentIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import {DocumentChartBarIcon} from "@heroicons/react/20/solid";
import { Button } from "../ui/button";
import { useNavigate,Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="p-3 flex flex-col gap-10 w-60 bg-gray-200 h-screen">
      <div
        className="flex gap-3 items-center text-xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        <DocumentIcon className="h-7 w-7 text-blue-500" />
        <h1 className=" font-normal text-2xl text-gray-700 font-sans tracking-tight">
          examium
        </h1>
      </div>
      <Button
        className="bg-blue-500 hover:bg-blue-600 flex gap-2"
        onClick={() => navigate("/create")}
      >
        New test <PlusCircleIcon className="w-6 h-6" />
      </Button>
      <div>
        <h4 className="font-medium text-md border-gray-300 border-b-2">Menu</h4>
        <ul className="p-2 text-md flex flex-col gap-2">
          <li><Link to="/tests/:id" className="flex gap-1"><DocumentChartBarIcon className="w-6 h-6"/>My tests</Link></li>
          <li><Link to="/collaborations">Collaborate</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
