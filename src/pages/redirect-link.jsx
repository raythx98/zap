import {redirect} from "@/api/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "react-spinners";
import Error from "../components/error";

const RedirectLink = () => {
  const {id} = useParams();

  const {loading, error, fn} = useFetch(redirect, id);

  useEffect(() => {
    fn();
  }, []);

  if (loading) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
      
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 mt-10">
        <h1 className="text-2xl font-bold text-white">Redirection Failed</h1>
        <p className="text-gray-500">The link might be invalid or has been deleted.</p>
      </div>
    );
  }

  return null;
};

export default RedirectLink;
