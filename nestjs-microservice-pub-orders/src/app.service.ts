import { Model, Schema } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderDTO } from './models/order.dto';
import { ClientDTO } from './models/client.dto';
import { ProductDTO } from './models/product.dto';
import { MicroserviceRepository } from './repositories/MicroserviceRepository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private microserviceRepository: MicroserviceRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async getOrders(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async newOrder(orderDto: OrderDTO): Promise<Order> {
    const client = await this.microserviceRepository.getClient(
      orderDto.clientId,
    );

    const product = await this.microserviceRepository.getProduct(
      orderDto.productId,
    );

    if (!this.isValidOrder(orderDto, client, product)) {
      throw new Error('Order Invalid');
    }

    const createdOrder = new this.orderModel({
      client,
      product,
      amount: orderDto.amount,
      status: [{ status: 'pending', date: new Date() }],
      total: orderDto.amount * product.price,
    });
    const orderSaved = await createdOrder.save();

    await this.amqpConnection.publish(
      process.env.EXCHANGE_NAME,
      process.env.ROUTING_KEY,
      {
        msg: { orderId: orderSaved['_id'] },
      },
      10000,
    );
    return orderSaved;
  }

  async updateOrder(_id: string, orderDto: OrderDTO): Promise<Order> {
    let order: Order = await this.orderModel.findOne({ _id });
    order.status.push({ status: orderDto.status, date: new Date() });
    await this.orderModel
      .findOneAndUpdate({ _id }, { status: order.status })
      .exec();
    return this.orderModel.findOne({ _id });
  }

  private async isValidOrder(
    orderDto: OrderDTO,
    client: ClientDTO,
    product: ProductDTO,
  ) {
    if (
      orderDto.amount > 0 &&
      orderDto.clientId === client.id &&
      orderDto.productId === product.id
    )
      return true;
    return false;
  }
}
