import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Eye, Lock } from 'lucide-react';

interface QuickActionsProps {
  onSubmitCode?: () => void;
  onStartReviewing?: () => void;
  onStakeCredits?: () => void;
}

export function QuickActions({ onSubmitCode, onStartReviewing, onStakeCredits }: QuickActionsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="heading-sm mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button 
            onClick={onSubmitCode}
            className="w-full h-auto py-4 flex flex-col gap-2"
            variant="default"
          >
            <Upload className="h-5 w-5" />
            <span className="label-lg">Submit Code for Review</span>
          </Button>
          <Button 
            onClick={onStartReviewing}
            className="w-full h-auto py-4 flex flex-col gap-2"
            variant="outline"
          >
            <Eye className="h-5 w-5" />
            <span className="label-lg">Start Reviewing</span>
          </Button>
          <Button 
            onClick={onStakeCredits}
            className="w-full h-auto py-4 flex flex-col gap-2"
            variant="outline"
          >
            <Lock className="h-5 w-5" />
            <span className="label-lg">Stake Credits</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}