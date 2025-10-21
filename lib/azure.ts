import "server-only";
import { BlobServiceClient, type ContainerClient } from "@azure/storage-blob";

export function getContainerClient(): ContainerClient {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_CONTAINER_NAME;

  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING env var is required");
  }
  if (!containerName) {
    throw new Error("AZURE_CONTAINER_NAME env var is required");
  }

  // Limpiar la connection string de espacios y comillas
  const cleanConnectionString = connectionString
    .trim()
    .replace(/^["']|["']$/g, "");

  try {
    const serviceClient = BlobServiceClient.fromConnectionString(
      cleanConnectionString
    );
    return serviceClient.getContainerClient(containerName);
  } catch (error: any) {
    console.error("Error creating Azure Blob client:", {
      error: error.message,
      hasConnectionString: !!connectionString,
      connectionStringLength: connectionString.length,
      containerName,
      // Log primeros y últimos caracteres para debug (sin exponer la key completa)
      connectionStringStart: connectionString.substring(0, 50),
    });
    throw new Error(`Failed to create Azure Blob client: ${error.message}`);
  }
}
