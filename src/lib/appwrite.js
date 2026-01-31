import { Client, Databases, Functions, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6978d04f002387164cbf");

export const databases = new Databases(client);
export const functions = new Functions(client); // ✅ Export functions
export { ID };