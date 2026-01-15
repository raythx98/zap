import { formatLink } from "@/helper/formatlink";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [suggestionType, setSuggestionType] = useState("none");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (!longUrl) return;

    const { formatted, type, isValid } = formatLink(longUrl);
    
    // If invalid, show error toast immediately
    if (!isValid) {
      toast.error("Please enter a valid URL (e.g. google.com)");
      return;
    }

    // If fixes were made, show suggestion
    if (type !== "none") {
      setSuggestion(formatted);
      setSuggestionType(type);
      return;
    }

    proceedWithUrl(longUrl);
  };

  const proceedWithUrl = (url) => {
    sessionStorage.setItem("urlToCreate", url);
    navigate("/auth");
  };

  const acceptSuggestion = () => {
    const suggestedUrl = suggestion;
    setSuggestion(null);
    proceedWithUrl(suggestedUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <section className="flex flex-col items-center justify-center w-full">
        <h2 className="mb-10 text-4xl sm:text-6xl lg:text-7xl text-white text-center font-black tracking-tight">
          The only URL Shortener <br /> you&rsquo;ll ever need! 👇
        </h2>
        <form
          onSubmit={handleShorten}
          className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
        >
          <Input
            placeholder="Enter your Loooong URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="h-full flex-1 py-4 px-4"
          />
          <Button type="submit" className="h-full px-8 font-bold" variant="destructive">
            Shorten!
          </Button>
        </form>
      </section>

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
            <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 font-mono text-blue-400 break-all text-center">
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
              Accept & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
