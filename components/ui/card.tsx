export function Card({ children, className }: React.PropsWithChildren<{ className?: string }>) {
    return <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>{children}</div>;
  }