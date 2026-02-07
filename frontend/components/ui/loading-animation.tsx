import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface LoadingAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
    text?: string
}

export function LoadingAnimation({ text = "Loading...", className, ...props }: LoadingAnimationProps) {
    return (
        <div
            className={cn("flex flex-col items-center justify-center space-y-4", className)}
            {...props}
        >
            <div className="relative flex items-center justify-center">
                <div className="absolute h-12 w-12 animate-ping rounded-full bg-primary/20" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm border border-primary/20">
                    <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
                </div>
            </div>
            {text && (
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    )
}
