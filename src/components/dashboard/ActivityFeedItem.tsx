import { formatDateTime } from '@/types/formatters';
import type { Activity } from '@/types/schema';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ActivityType } from '@/types/enums';
import { Code, Star, Coins, CheckCircle, Upload, FileCheck } from 'lucide-react';

interface ActivityFeedItemProps {
  activity: Activity;
}

export function ActivityFeedItem({ activity }: ActivityFeedItemProps) {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CODE_SUBMITTED:
        return <Upload className="h-4 w-4" />;
      case ActivityType.REVIEW_RECEIVED:
        return <Star className="h-4 w-4" />;
      case ActivityType.REVIEW_GIVEN:
        return <CheckCircle className="h-4 w-4" />;
      case ActivityType.CREDITS_EARNED:
        return <Coins className="h-4 w-4" />;
      case ActivityType.CREDITS_SPENT:
        return <Coins className="h-4 w-4" />;
      case ActivityType.ANALYSIS_COMPLETE:
        return <FileCheck className="h-4 w-4" />;
      case ActivityType.STAKING_UPDATED:
        return <Code className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CREDITS_EARNED:
        return 'text-success';
      case ActivityType.CREDITS_SPENT:
        return 'text-warning';
      case ActivityType.REVIEW_RECEIVED:
      case ActivityType.ANALYSIS_COMPLETE:
        return 'text-info';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
      <div className={`mt-1 ${getActivityColor(activity.type)}`}>
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="body-md text-foreground">{activity.message}</p>
        <p className="body-sm text-muted-foreground mt-1">
          {formatDateTime(activity.timestamp)}
        </p>
      </div>
      {activity.creditsAmount && (
        <Badge variant="secondary" className="shrink-0">
          +{activity.creditsAmount} DCC
        </Badge>
      )}
    </div>
  );
}