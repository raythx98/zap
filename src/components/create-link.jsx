import { formatLink } from "@/helper/formatlink";
import {Copy, QrCode} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Error from "./error";
import {z} from "zod";
import useFetch from "@/hooks/use-fetch";
import {createUrl} from "@/api/apiUrls";
import {BeatLoader} from "react-spinners";
import {UrlState} from "@/context";
import { FaCheckCircle } from 'react-icons/fa'; 
import {QRCode} from "react-qrcode-logo";
import { toast } from "sonner";

export function CreateLink({ 
  buttonText = "Create New Link", 
  variant = "destructive",
  className = ""
}) {
  const navigate = useNavigate();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = sessionStorage.getItem("urlToCreate");
  const isLoggedIn = searchParams.get("isLoggedIn");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    fullUrl: longLink || "",
    customUrl: "",
  });
  const [finalLink, setFinalLink] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [suggestionType, setSuggestionType] = useState("none");

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, {...formValues});

  useEffect(() => {
    if (error === null && data) {
      toast.success("Link created successfully!");
      sessionStorage.removeItem("urlToCreate");
      if (isLoggedIn == "true" || buttonText == "Create New Link") {
        navigate(`/link/${data.id}`);
      } else {
        setFinalLink(data.short_url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const fullShortUrl = `${window.location.origin}${import.meta.env.BASE_URL}${finalLink}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(fullShortUrl);
    toast.success("Link copied to clipboard!");
  };

  const downloadImage = () => {
    const canvas = document.getElementById("qr-create-link");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${formValues.title || "qr-code"}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR Code downloaded successfully!");
    }
  };

  const acceptSuggestion = () => {
    const suggestedUrl = suggestion;
    setSuggestion(null);
    setFormValues(prev => ({ ...prev, fullUrl: suggestedUrl }));
    // We delay the actual creation slightly to ensure state is updated
    setTimeout(() => createNewLink(suggestedUrl, true), 10);
  };

  const createNewLink = async (overrideUrl = null, force = false) => {
    setErrors({});
    const urlToValidate = overrideUrl || formValues.fullUrl;
    const { formatted, type, isValid } = formatLink(urlToValidate);
    
    // If invalid, show error toast immediately
    if (!isValid && urlToValidate.length > 0) {
      toast.error("Please enter a valid URL (e.g. google.com)");
      return;
    }

    // If protocol was added and we're not forcing, show suggestion
    if (!force && type !== "none") {
      setSuggestion(formatted);
      setSuggestionType(type);
      return;
    }

    try {
      const schema = z.object({
        title: z
          .string()
          .max(100, "Title must be at most 100 characters")
          .optional()
          .or(z.literal("")),
        fullUrl: z
          .string()
          .url("Must be a valid URL")
          .min(1, "Long URL is required")
          .max(2048, "Long URL must be at most 2048 characters"),
        customUrl: z
          .string()
          .optional()
          .refine(val => !val || val.length >= 4, {
            message: "Custom URL must be at least 4 characters",
          })
          .refine(val => !val || val.length <= 255, {
            message: "Custom URL must be at most 255 characters",
          }),
      });

      schema.parse({ ...formValues, fullUrl: formatted });
      await fnCreateUrl();
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors = {};
        e.issues.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const reset = async () => {
    setFinalLink(null);
    sessionStorage.removeItem("urlToCreate");
    setFormValues({
      title: "",
      fullUrl: "",
      customUrl: "",
    });
  };

  return (
    <>
    <Dialog
      defaultOpen={isLoggedIn == 'true' && !!longLink}
      onOpenChange={(res) => {
        if (!res) {
          if (isLoggedIn === 'true') setSearchParams({});
          sessionStorage.removeItem("urlToCreate");
          setFormValues({ title: "", fullUrl: "", customUrl: "" });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white rounded-2xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="font-black text-3xl tracking-tight">Create New Link</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Link Title</span>
              <span className="text-[10px] font-bold text-gray-600 uppercase bg-gray-800 px-1.5 py-0.5 rounded">Optional</span>
            </div>
            <Input
              id="title"
              placeholder="e.g. My Awesome Project"
              value={formValues.title}
              onChange={handleChange}
              disabled={finalLink}
              className="bg-gray-800 border-gray-700 focus:border-blue-500"
            />
            {errors.title && <Error message={errors.title} />}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loooong URL</span>
            <Input
              id="fullUrl"
              placeholder="e.g. https://very-long-link-that-needs-shortening.com"
              value={formValues.fullUrl}
              onChange={handleChange}
              disabled={finalLink}
              className="bg-gray-800 border-gray-700 focus:border-blue-500"
            />
            {errors.fullUrl && <Error message={errors.fullUrl} />}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Link</span>
              <span className="text-[10px] font-bold text-gray-600 uppercase bg-gray-800 px-1.5 py-0.5 rounded">Optional</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder={window.location.origin + import.meta.env.BASE_URL}
                value={window.location.origin + import.meta.env.BASE_URL}
                disabled={true}
                className="bg-gray-800/50 border-gray-800 text-gray-500 text-sm hidden sm:block"
              />
              <span className="text-gray-600 hidden sm:inline">/</span>
              <Input
                id="customUrl"
                placeholder="custom-slug"
                value={formValues.customUrl}
                onChange={handleChange}
                disabled={finalLink}
                className="bg-gray-800 border-gray-700 focus:border-blue-500"
              />
            </div>
            {errors.customUrl && <Error message={errors.customUrl} />}
          </div>
        </div>

        {finalLink && (
          <div className="flex flex-col gap-4 p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl items-center text-center">
            <div className="flex items-center gap-2 text-blue-400">
              <FaCheckCircle size={24}/>
              <span className="font-bold text-lg">Your Zap is ready!</span>
            </div>
            <div className="flex w-full items-center gap-2 bg-gray-900 p-2 rounded-lg border border-gray-800">
              <span className="flex-1 font-mono text-sm text-blue-400 truncate px-2">{fullShortUrl}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-800 text-white"
                onClick={handleCopyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 hover:bg-gray-800 text-white"
                onClick={downloadImage}
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
            <div style={{ display: 'none' }}>
              <QRCode
                id="qr-create-link"
                value={fullShortUrl}
                size={250}
                quietZone={2}
              />
            </div>
          </div>
        )}
        
        {error && null}
        
        <DialogFooter className="mt-4 sm:justify-end">
          { finalLink 
            ? (
              <Button
                type="button"
                variant="outline"
                onClick={reset}
                className="w-full sm:w-auto border-gray-700 hover:bg-gray-800"
              >
                Create Another
              </Button>
            )
            : (
              <Button
                type="button"
                variant="destructive"
                onClick={() => createNewLink()}
                disabled={loading}
                className="w-full sm:w-auto font-bold h-11 px-8"
              >
                {loading ? <BeatLoader size={8} color="white" /> : "Shorten URL"}
              </Button>
            )
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={!!suggestion} onOpenChange={() => setSuggestion(null)}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white rounded-2xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="font-black text-2xl tracking-tight">
            {suggestionType === "fixed" ? "URL Protocol Added" : "URL Formatting Cleaned"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-gray-400">
            {suggestionType === "fixed" 
              ? "We noticed your link was missing a protocol. We've updated it to:" 
              : "We've cleaned up the formatting of your URL to ensure it works correctly:"}
          </p>
          <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 font-mono text-blue-400 break-all">
            {suggestion}
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setSuggestion(null)}
            className="border-gray-700 hover:bg-gray-800"
          >
            Keep Editing
          </Button>
          <Button 
            variant="destructive" 
            onClick={acceptSuggestion}
            className="font-bold"
          >
            Accept & Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}