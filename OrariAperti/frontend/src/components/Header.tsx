import {ModeToggle} from "@/components/mode-toggle.tsx";

export default function Header() {
  return (
      <>
          <header className={"flex items-center justify-between p-3 bg-secondary text-primary"}>
              <div className={"flex items-center gap-2"}>
                  <div className={"flex flex-col"}>
                      <span className={"text-3xl font-bold"}>OrariAperti</span>
                  </div>
              </div>
              <div className={"flex items-center gap-4 "}>
                  <ModeToggle/>
              </div>
          </header>
      </>
  );
}

