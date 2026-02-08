import {BooksService} from './books.service.js';
import {  RolesGuard } from "../guards/roles.guard.js";
import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from "../../core/index.js";
import { Roles } from "../decorators/roles.decorator.js";
import { ZodValidationPipe } from "../pipes/zod.pipe.js";

@Controller('/books')
@UseGuards(RolesGuard)
export class BooksController {
  constructor(private svc: BooksService) {}

  @Get('/')
  @Roles('admin')
  list() {
    return this.svc.findAll();
  }

  @Get('/:id')
  one(@Param('id') id:string) {
    return this.svc.findOne(+id);
  }

  @Post('/')
  @UsePipes(ZodValidationPipe)
  add(@Body() body: { title: string }) {
    return this.svc.create(body.title);
  }
}
