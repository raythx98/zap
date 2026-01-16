import {Copy, QrCode, LinkIcon, Trash, Calendar} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {Button} from "./ui/button";
import {deleteUrl} from "@/api/apiUrls";
import {BeatLoader} from "./ui/loaders";
import {QRCode} from "react-qrcode-logo";
import { toast } from "sonner";
import { downloadImage } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useState, useEffect, useTransition, useCallback} from "react";

const LinkCard = ({url = [], fetchUrls, onDelete}) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  // Fix URL generation to include base path
  const shortUrl = `${window.location.origin}${import.meta.env.BASE_URL}${url?.custom_url || url.short_url}`;

  const handleDownload = (e) => {
    e.stopPropagation();
    downloadImage(`qr-${url?.id}`, url?.title || "qr-code");
  };

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete();
      setIsDeleteModalOpen(false);
      return;
    }
    startTransition(async () => {
      try {
        await deleteUrl(url.id);
        fetchUrls();
        setIsDeleteModalOpen(false);
        toast.success("Link deleted successfully!");
      } catch (error) {
        // Error already toasted by parseError in API layer
      } 
    });
  }, [url.id, fetchUrls, onDelete]);

  const handleCardClick = () => {
    navigate(`/link/${url?.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && isDeleteModalOpen) {
        handleDelete();
      }
    };
    if (isDeleteModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDeleteModalOpen, handleDelete]);

  return (
    <div 
      onClick={handleCardClick}
      className="flex flex-col sm:flex-row gap-5 border border-gray-800 p-6 bg-gray-900 rounded-xl cursor-pointer hover:border-blue-500/50 transition-all shadow-lg items-center w-full overflow-hidden"
    >
      <div className="h-32 w-32 object-contain ring-2 ring-blue-500/20 p-2 bg-white rounded-xl flex items-center justify-center shadow-inner shrink-0">
        <QRCode
          id={`qr-${url?.id}`}
          value={shortUrl}
          size={110}
          quietZone={2}
        />
      </div>
      <div className="flex flex-col flex-1 gap-2 min-w-0 w-full overflow-hidden">
        {url?.title && (
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</span>
            <span className="text-2xl font-extrabold text-white truncate w-full">
              {url?.title}
            </span>
          </div>
        )}
        
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Short Link</span>
          <span className="text-lg text-blue-400 font-bold truncate w-full">
            {shortUrl}
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Original URL</span>
          <span className="flex items-center gap-1 text-gray-400 text-sm min-w-0">
            <LinkIcon className="h-3 w-3 flex-shrink-0" />
            <span className="truncate flex-1">{url?.full_url}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Calendar className="h-3 w-3 text-gray-500 shrink-0" />
          <span className="text-xs font-medium text-gray-500 truncate">
            {new Date(url?.created_at).toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="flex flex-row gap-3 justify-center sm:justify-end w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-800" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full hover:bg-blue-600 hover:text-white transition-colors"
          onClick={() => {
            navigator.clipboard.writeText(shortUrl);
            toast.success("Link copied to clipboard!");
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon"
          className="rounded-full hover:bg-green-600 hover:text-white transition-colors"
          onClick={handleDownload}
        >
          <QrCode className="h-4 w-4" />
        </Button>
        
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              size="icon"
              className="rounded-full hover:bg-red-600 hover:text-white transition-colors text-red-400"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Link</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this link? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                {isPending ? <BeatLoader size={5} color="white" /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LinkCard;