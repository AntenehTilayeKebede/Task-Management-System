import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS and specify the origin (your React frontend's URL)
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your React app's URL
    credentials: true, // Enable credentials (e.g., cookies)
  });

  await app.listen(8000);
}
bootstrap();