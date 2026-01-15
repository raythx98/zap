import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {deleteUrl, getUrl} from "@/api/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {Copy, QrCode, LinkIcon, Trash, Calendar} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";
import {QRCode} from "react-qrcode-logo";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Error from "../components/error";


const LinkPage = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    loading,
    data,
    fn,
    error,
  } = useFetch(getUrl, {id});

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  let link = "";
  if (data?.url) {
    link = data?.url?.custom_url ? data?.url?.custom_url : data?.url.short_url;
  }
  const fullLink = `${window.location.origin}${import.meta.env.BASE_URL}${link}`;

  const downloadImage = () => {
    const canvas = document.getElementById("qr-code-canvas");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${data?.url?.title || "qr-code"}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR Code downloaded successfully!");
    }
  };

  const handleDelete = () => {
    fnDelete().then(() => {
      navigate("/dashboard");
      toast.success("Link deleted successfully!");
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {(loading) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      
      <div className="flex flex-col gap-8 lg:flex-row justify-between">
        <div className="flex flex-col gap-6 lg:w-2/5">
          <div className="flex flex-col gap-6 border border-gray-800 p-8 bg-gray-900 rounded-2xl shadow-xl">
            {data?.url?.title && (
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white break-all">
                  {data?.url?.title}
                </h1>
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Short Link</span>
              <a
                href={fullLink}
                target="_blank"
                className="text-2xl sm:text-3xl text-blue-400 font-bold hover:underline break-all"
              >
                {fullLink}
              </a>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Original URL</span>
              <a
                href={data?.url?.full_url}
                target="_blank"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors break-all"
              >
                <LinkIcon className="h-4 w-4 shrink-0" />
                <span className="text-lg">{data?.url?.full_url}</span>
              </a>
            </div>

            <div className="flex items-center gap-2 py-2 border-t border-gray-800">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">
                Created: {new Date(data?.url?.created_at).toLocaleString()}
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-md"
                onClick={() => {
                  navigator.clipboard.writeText(fullLink);
                  toast.success("Link copied to clipboard!");
                }}
              >
                <Copy className="h-5 w-5" />
              </Button>
              <Button 
                variant="secondary" 
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-green-600 hover:text-white transition-all shadow-md"
                onClick={downloadImage}
              >
                <QrCode className="h-5 w-5" />
              </Button>

              <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon"
                    className="h-12 w-12 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-md text-red-400"
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Link</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this link? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loadingDelete}>
                      {loadingDelete ? <BeatLoader size={5} color="white" /> : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="border border-gray-800 p-8 bg-gray-900 rounded-2xl shadow-xl flex flex-col items-center gap-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider self-start">QR Code</span>
            <div className="bg-white p-4 rounded-xl shadow-inner">
              <QRCode
                  id="qr-code-canvas"
                  value={fullLink}
                  size={250}
                  style={{ width: '100%', height: 'auto', maxWidth: '250px' }}
                  quietZone={2}
              />
            </div>
          </div>
        </div>

        <Card className="lg:w-3/5 bg-gray-900 border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="border-b border-gray-800 bg-gray-900/50">
            <CardTitle className="text-4xl font-extrabold tracking-tight">Analytics</CardTitle>
          </CardHeader>
          {data?.total_clicks ? (
            <CardContent className="flex flex-col gap-10 p-8">
              <Card className="bg-gray-800/50 border-gray-700 shadow-md transform hover:scale-[1.02] transition-transform duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <p className="text-6xl font-black text-white">{data?.total_clicks}</p>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-blue-500 rounded-full" />
                  <h3 className="text-2xl font-bold text-white">Location Data</h3>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-800">
                  <Location countries={data?.countries} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-green-500 rounded-full" />
                  <h3 className="text-2xl font-bold text-white">Device Info</h3>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-800">
                  <DeviceStats devices={data?.devices} />
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-20 text-center">
              <p className="text-gray-500 text-xl italic">
                {loading === false
                  ? "No Statistics yet. Share your link to see data!"
                  : "Loading Statistics.."}
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LinkPage;