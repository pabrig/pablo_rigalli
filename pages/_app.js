import React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { Header, Footer } from "../components";

function MyApp({ Component, pageProps }) {
  return (
    <Box>
      <ChakraProvider>
        <Box
          boxShadow="md"
          display="grid"
          padding={5}
          marginY={5}
          height="100vh"
          justifyContent="center"
          alignItems="center"
          borderRadius={15}
        >
          <Header />
          <Component {...pageProps} />
          <Footer />
        </Box>
      </ChakraProvider>
    </Box>
  );
}

export default MyApp;
