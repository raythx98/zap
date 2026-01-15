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
import * as yup from "yup";
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
  const {user} = UrlState();

  const navigate = useNavigate();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const isLoggedIn = searchParams.get("isLoggedIn");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    fullUrl: longLink ? longLink : "",
    customUrl: "",
  });
  const [finalLink, setFinalLink] = useState("");

  const schema = yup.object().shape({
    title: yup
      .string()
      .required("Title is required")
      .max(100, "Title must be at most 255 characters"),
    fullUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required")
      .max(2048, "Long URL must be at most 255 characters"),
    customUrl: yup
      .string()
      .test(
        'custom-url-check-min-4',
        'Custom URL must be at least 4 characters',
        password => password.length == 0 || password.length >= 4)
      .test(
        'custom-url-check-max-255',
        'Custom URL must be at most 255 characters',
        password => password.length == 0 || password.length <= 255),
  });

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
  } = useFetch(createUrl, {...formValues, user_id: user?.id});

  useEffect(() => {
    if (error === null && data) {
      toast.success("Link created successfully!");
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

  const createNewLink = async () => {
    setErrors([]);
    var proposedLink = formatLink(formValues.fullUrl);
    var oldLink = formValues.fullUrl
    const newErrors = {};
    if (formValues.fullUrl != proposedLink) {
      formValues.fullUrl = proposedLink;
      newErrors["fullUrl"] = `Invalid URL. Corrected from '${oldLink}' to '${proposedLink}'. Please try again.`;
    }
    try {
      await schema.validate(formValues, {abortEarly: false});

      if (newErrors["fullUrl"]) {
        throw new Error("Invalid URL");
      }

      await fnCreateUrl();
    } catch (e) {
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
    }
    setErrors(newErrors);
  };

  const reset = async () => {
    setFinalLink(null);
    setFormValues({
      title: "",
      fullUrl: "",
      customUrl: "",
    });
  };

  return (
    <Dialog
      defaultOpen={isLoggedIn == 'true' && !!longLink}
      onOpenChange={(res) => {
        if (!res && isLoggedIn === 'true') setSearchParams({});
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
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Link Title</span>
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
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Link (optional)</span>
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
        
        {error && <Error message={error?.message} />}
        
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
                onClick={createNewLink}
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
  );
}