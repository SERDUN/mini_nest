import { NestFactory, ValidationPipe } from "./core/index.js";
import { BooksModule } from "./apps/books/books.module.js";

process.on('uncaughtException', (err) => {
  console.error('CRITICAL ERROR:', err);
});

console.log('Initialize!');

const app = await NestFactory.create(BooksModule);

app.use((req, res, next) => {
  console.log(`[Middleware] Incoming request: ${req.method} ${req.url}`);
  next();
});
app.useGlobalPipes(new ValidationPipe("Global pipe"));

await app.listen(3000);
