import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[]
  defaultTab?: string
  className?: string
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  )
}
