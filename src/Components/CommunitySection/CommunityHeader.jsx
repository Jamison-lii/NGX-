import { Globe, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function CommunityHeader({ title }) {
  return (
    <header className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-7 md:px-8 xl:px-10">
     <Link to="/"> <div className="text-[22px] font-semibold tracking-[-0.03em] text-[#505158]">
        NGX
      </div> </Link>

      <h2 className="text-[20px] font-medium tracking-[-0.03em] text-[#2d2e34] md:text-[24px]">
        {title}
      </h2>

      <div className="flex items-center gap-5 text-[#505158]">
        <button className="flex items-center gap-2 text-[16px] font-medium">
          <Globe className="h-5 w-5" strokeWidth={1.9} />
          <span>EN</span>
        </button>
       
      </div>
    </header>
  );
}