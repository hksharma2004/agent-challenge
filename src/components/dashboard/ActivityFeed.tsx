"use client";

import { useState, useEffect } from 'react';
import type { Activity } from '@/types/schema';
import { ActivityFeedItem } from './ActivityFeedItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities: initialActivities }: ActivityFeedProps) {
  const [activities, setActivities] = useState(initialActivities);

  // Simulate real-time updates
  useEffect(() => {
    setActivities(initialActivities);
  }, [initialActivities]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Latest Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4">
            {activities.length === 0 ? (
              <p className="body-md text-muted-foreground text-center py-8">
                No recent activity
              </p>
            ) : (
              activities.map((activity) => (
                <ActivityFeedItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}