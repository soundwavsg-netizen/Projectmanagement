"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Activity as ActivityIcon } from "lucide-react"

interface Activity {
  id: string
  action: string
  entity: string
  entityId?: string
  details?: string
  actor: string
  createdAt: string
}

interface ActivityLogProps {
  activities: Activity[]
}

export function ActivityLog({ activities }: ActivityLogProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'Created': return 'default'
      case 'Updated': return 'secondary'
      case 'Deleted': return 'destructive'
      case 'StatusChanged': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <ActivityIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No activity yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {activities.map(activity => (
            <Card key={activity.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Badge variant={getActionColor(activity.action) as any} className="mt-0.5">
                    {activity.action}
                  </Badge>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm">
                        <span className="font-medium">{activity.actor}</span>
                        {activity.details && (
                          <span className="text-muted-foreground"> {activity.details}</span>
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
