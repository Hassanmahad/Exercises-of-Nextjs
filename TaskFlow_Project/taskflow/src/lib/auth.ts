
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import clientPromise from "@/lib/mongodb-client";

export const auth = betterAuth({
  database: mongodbAdapter(
    (await clientPromise).db("taskflow")
  ),

  emailAndPassword: {
    enabled: true,
  },
});
