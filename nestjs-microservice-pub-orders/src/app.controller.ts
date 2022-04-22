import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderDTO } from './models/order.dto';

@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getOrders() {
    return this.appService.getOrders();
  }

  @Post()
  newOrder(@Body() order: OrderDTO) {
    return this.appService.newOrder(order);
  }

  @Patch(':id')
  updateOrder(@Param('id') _id: string, @Body() order: OrderDTO) {
    return this.appService.updateOrder(_id, order);
  }
}
