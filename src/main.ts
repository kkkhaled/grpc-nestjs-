import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Connect gRPC Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5000', // gRPC server URL
      package: ['auth'], // Proto package name
      protoPath: [join(__dirname, '../src/proto/auth.proto')], // proto path
    },
  });

  // Start the Microservice
  await app.startAllMicroservices();

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Start the HTTP server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
