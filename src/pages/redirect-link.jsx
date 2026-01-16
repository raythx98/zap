import {redirect} from "@/api/apiUrls";
import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "@/components/ui/loaders";

const RedirectLink = () => {
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasRedirected = useRef(false);

  useEffect(() => {
    const performRedirect = async () => {
      if (hasRedirected.current) return;
      hasRedirected.current = true;

      try {
        setLoading(true);
        await redirect(id);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    performRedirect();
  }, [id]);

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