import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { ClientDTO } from '../models/client.dto';
import { ProductDTO } from '../models/product.dto';

@Injectable()
export class MicroserviceRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async getClient(clientId: number): Promise<ClientDTO> {
    const clientCached: ClientDTO = await this.cacheManager.get(
      `client:${clientId}`,
    );
    if (clientCached) {
      console.log('get clientCached', clientCached);
      return Promise.resolve(clientCached);
    }

    const responseClient = await axios.get(
      `${process.env.Client_MS_URL}/${clientId}`,
    );

    await this.cacheManager.set(`client:${clientId}`, responseClient.data, {
      ttl: Number(process.env.TIMEOUT_CACHE_CLIENT),
    });
    return responseClient.data;
  }

  public async getProduct(productId: number): Promise<ProductDTO> {
    const productCached: ProductDTO = await this.cacheManager.get(
      `product:${productId}`,
    );

    if (productCached) {
      console.log('get productCached', productCached);
      return Promise.resolve(productCached);
    }

    const responseProduct = await axios.get(
      `${process.env.Product_MS_URL}/${productId}`,
    );

    await this.cacheManager.set(`product:${productId}`, responseProduct.data, {
      ttl: Number(process.env.TIMEOUT_CACHE_PRODUCT),
    });

    return responseProduct.data;
  }
}
