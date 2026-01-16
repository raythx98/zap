import {useEffect, useState, useOptimistic, useTransition} from "react";
import {BarLoader} from "@/components/ui/loaders";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {CreateLink} from "@/components/create-link";
import LinkCard from "@/components/link-card";
import { toast } from "sonner";

import {getUrls, deleteUrl} from "@/api/apiUrls";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0); // New state variable
  const [, startTransition] = useTransition();

  const [optimisticUrls, removeOptimisticUrl] = useOptimistic(
    urls,
    (state, urlId) => state.filter(url => url.id !== urlId)
  );

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const data = await getUrls();
      setUrls(data?.urls || []);
      setTotalClicks(data?.total_clicks || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const filteredUrls = optimisticUrls.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (urlId) => {
    startTransition(async () => {
      removeOptimisticUrl(urlId);
      try {
        await deleteUrl(urlId);
        toast.success("Link deleted successfully!");
        // We don't strictly need to fetchUrls() here if we trust the optimistic state,
        // but it's good to keep it in sync for things like "Total Clicks" if they change.
        const data = await getUrls();
        setUrls(data?.urls || []);
      } catch (error) {
        // Error already toasted by parseError in API layer
        // Error will cause optimistic state to revert
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      {loading && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-900 border-gray-800 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider text-center">Links Created</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <p className="text-4xl font-bold text-white">{optimisticUrls.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider text-center">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <p className="text-4xl font-bold text-white">
              {totalClicks}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-4xl font-extrabold tracking-tight">My Links</h1>
        <CreateLink />
      </div>
      <div className="relative group">
        <Input
          type="text"
          placeholder="Filter Links by Title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-4 pr-10 py-6 bg-gray-900 border-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>
      {filteredUrls.map((url) => (
        <LinkCard key={url.id} url={url} fetchUrls={fetchUrls} onDelete={() => handleDelete(url.id)} />
      ))}
    </div>
  );
};

export default Dashboard;
