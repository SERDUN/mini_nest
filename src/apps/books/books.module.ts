import { BooksController } from "./books.controller.js";
import { BooksService } from "./books.service.js";
import { Module } from "../../core/index.js";

@Module({
  controllers: [BooksController],
  providers:   [BooksService],
})
export class BooksModule {}
