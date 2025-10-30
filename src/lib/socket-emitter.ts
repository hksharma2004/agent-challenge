import { Server } from 'socket.io';

export class SocketEmitter {
  static async emitCreditUpdate(io: Server, userId: string, data: any) {
    io.to(`user:${userId}`).emit('credit_balance_updated', data);
  }

  static async emitTransactionAdded(io: Server, userId: string, transaction: any) {
    io.to(`user:${userId}`).emit('transaction_added', transaction);
  }
}
