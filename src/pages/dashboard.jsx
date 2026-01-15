// can add sonner from shadcn ui after link created

import {useEffect, useState} from "react";
import {BarLoader} from "react-spinners";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {CreateLink} from "@/components/create-link";
import LinkCard from "@/components/link-card";
import Error from "@/components/error";

import useFetch from "@/hooks/use-fetch";

import {getUrls} from "@/api/apiUrls";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {loading, error, data, fn: fnUrls} = useFetch(getUrls);

  useEffect(() => {
    fnUrls();
  }, []);

  const filteredUrls = data?.urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 pt-4">
      {(loading) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-900 border-gray-800 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider text-center">Links Created</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <p className="text-4xl font-bold text-white">{data?.urls?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 shadow-lg transform hover:scale-105 transition-transform duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider text-center">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <p className="text-4xl font-bold text-white">{data?.total_clicks || 0}</p>
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
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-4 pr-10 py-6 bg-gray-900 border-gray-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url, i) => (
        <LinkCard key={i} url={url} fetchUrls={fnUrls} />
      ))}
    </div>
  );
};

export default Dashboard;
