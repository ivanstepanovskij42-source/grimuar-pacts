import { cn } from "@/lib/utils";

interface IronFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function IronFrame({ children, className, title }: IronFrameProps) {
  return (
    <div className={cn("grimoire-frame p-6 sm:p-8", className)}>
      <div className="iron-corner iron-corner-tl" />
      <div className="iron-corner iron-corner-tr" />
      <div className="iron-corner iron-corner-bl" />
      <div className="iron-corner iron-corner-br" />
      
      {title && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background px-4 border-l border-r border-accent z-20">
          <h2 className="text-sm font-bold tracking-[0.2em] whitespace-nowrap">{title}</h2>
        </div>
      )}
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}