import { formatLink } from "@/helper/formatlink";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {UrlState} from "@/context";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();
  const {user} = UrlState();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${formatLink(longUrl)}`);
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
    </div>
  );
};

export default LandingPage;
