import { motion } from "framer-motion";
import { HeaderIsland } from "./HeaderIsland";
import { ScrollLink } from "./ScrollLink";

export function Header() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-[100] isolate pointer-events-none">
      <div className="page-container flex items-center h-[var(--site-header-bar)] w-full pointer-events-auto mt-2">
        <div className="w-full grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-14">
          <div className="hidden lg:block" />
          <div className="flex items-center w-full gap-4">
            <HeaderIsland />
            
            <motion.div whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }} transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} className="ml-auto">
              <ScrollLink
                href="/"
                className="header-brand flex items-center shrink-0"
                aria-label="UPRAISER — The Basecamp"
              >
                <img src="/upraiser-logo.png" alt="" className="h-7 w-7 object-contain" />
              </ScrollLink>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
