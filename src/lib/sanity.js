import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: "2023-10-01",
  useCdn: true,
});

// Create the URL builder
const builder = imageUrlBuilder(client);

// Helper function to get image URLs
export const urlFor = (source) => builder.image(source);
