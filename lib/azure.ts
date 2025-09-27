import 'server-only';
import { BlobServiceClient, type ContainerClient } from '@azure/storage-blob';

export function getContainerClient(): ContainerClient {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_CONTAINER_NAME;

  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING env var is required');
  }
  if (!containerName) {
    throw new Error('AZURE_CONTAINER_NAME env var is required');
  }

  const serviceClient = BlobServiceClient.fromConnectionString(connectionString);
  return serviceClient.getContainerClient(containerName);
}

