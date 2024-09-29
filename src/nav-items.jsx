import { HomeIcon } from "lucide-react";
import ImageGenerator from "./pages/ImageGenerator.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <ImageGenerator />,
  },
];