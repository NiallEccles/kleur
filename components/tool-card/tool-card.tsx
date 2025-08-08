import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import {ArrowRight, LucideIcon} from "lucide-react"
import Link from "next/link"

interface ToolCardProps {
    title: string
    description: string
    icon: LucideIcon
    href: string
    badge?: string
    preview?: React.ReactNode
    isNew?: boolean
    isPopular?: boolean
}

export default function ToolCard({
                                     title,
                                     description,
                                     icon: Icon,
                                     href,
                                     badge,
                                     preview,
                                     isNew,
                                     isPopular,
                                 }: ToolCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all duration-200 shadow-none outline-none border-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-zinc-900">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-950 rounded-lg">
                            <Icon className="w-5 h-5 text-black dark:text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{title}</CardTitle>
                            {/*{badge && (*/}
                            {/*    <Badge variant="secondary" className="mt-1 text-xs">*/}
                            {/*        {badge}*/}
                            {/*    </Badge>*/}
                            {/*)}*/}
                        </div>
                    </div>
                    <div className="flex space-x-1">
                        {/*{isNew && (*/}
                        {/*    <Badge variant="default" className="text-xs bg-emerald-500 hover:bg-emerald-600">*/}
                        {/*        New*/}
                        {/*    </Badge>*/}
                        {/*)}*/}
                        {/*{isPopular && (*/}
                        {/*    <Badge variant="default" className="text-xs bg-orange-500 hover:bg-orange-600">*/}
                        {/*        Popular*/}
                        {/*    </Badge>*/}
                        {/*)}*/}
                    </div>
                </div>
                <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
            </CardHeader>

            {/*{preview && (*/}
            {/*    <div className="px-6 pb-4">*/}
            {/*        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 border">*/}
            {/*            {preview}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

            <CardContent className="pt-0 text-white dark:text-zinc-100 flex flex-1 items-end justify-end">
                <Button asChild className="group-hover:bg-primary/90 dark:bg-zinc-800">
                    <Link href={href}>Try Tool <ArrowRight /></Link>
                </Button>
            </CardContent>
        </Card>
    )
}
