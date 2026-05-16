interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
