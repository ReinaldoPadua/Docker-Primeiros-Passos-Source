import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: SchemaType.Types.ObjectId })
  id: string;

  @Prop({ type: Object })
  client: {};

  @Prop({ type: Object })
  product: {};

  @Prop({ type: Array })
  status: [any];

  @Prop()
  amount: number;

  @Prop()
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
