import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { CreditTransaction } from '@/types/schema';
import { formatDateTime, formatCredits, formatTransactionType } from '@/types/formatters';
import { TransactionType } from '@/types/enums';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TransactionHistoryProps {
  transactions: CreditTransaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.EARNED:
        return 'text-success';
      case TransactionType.SPENT:
        return 'text-destructive';
      case TransactionType.STAKED:
        return 'text-warning';
      case TransactionType.UNSTAKED:
        return 'text-info';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No transactions yet
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {formatTransactionType(transaction.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="body-sm">{transaction.description}</TableCell>
                    <TableCell className={`font-medium ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} DCC
                    </TableCell>
                    <TableCell className="body-sm text-muted-foreground">
                      {formatDateTime(transaction.timestamp)}
                    </TableCell>
                    <TableCell className="text-right body-sm">
                      {formatCredits(transaction.balanceAfter)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}