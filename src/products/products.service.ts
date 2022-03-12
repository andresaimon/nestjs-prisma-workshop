import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from './../prisma/prisma.service';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Prisma } from '@prisma/client';
import { ConnectionArgs } from 'src/page/connection-args.dto';
import { ProductEntity } from './entities/product.entity';
import { Page } from 'src/page/page.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /*
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }
  */

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  /*
  findAll() {
    return `This action returns all products`;
  }
  */

  findAll() {
    return this.prisma.product.findMany({ where: { published: true } });
  }

  /*
  findOne(id: number) {
    return `This action returns a #${id} product`;
  }
*/

    async findPage(connectionArgs: ConnectionArgs) {
      const where: Prisma.ProductWhereInput = {
        published: true,
      };
      return findManyCursorConnection(
        (args) =>
          this.prisma.product.findMany({
            ...args, // 👈 apply paging arguments
            where: where,
          }),
        () => this.prisma.product.count({
            where: where, // 👈 apply paging arguments
          }),
        connectionArgs, // 👈 use connection arguments
        {
          recordToEdge: (record) => ({
            node: new ProductEntity(record), // 👈 instance to transform price
          }),
        },
      );
    //  return new Page<ProductEntity>(productPage); // 👈 instance as this object is
    }
       

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id: id } });
  }

  findDrafts() {
    return this.prisma.product.findMany({ where: { published: false } });
  }

  /*
  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }
  */

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id: id },
      data: updateProductDto,
    });
  }

  /*
  remove(id: number) {
    return `This action removes a #${id} product`;
  }
  */

  remove(id: string) {
    return this.prisma.product.delete({ where: { id: id } });
  }
  
}
