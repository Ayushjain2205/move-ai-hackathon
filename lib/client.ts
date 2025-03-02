import { createThirdwebClient } from "thirdweb";

// Initialize the client
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});
