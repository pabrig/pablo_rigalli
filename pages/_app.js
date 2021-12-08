import React from 'react';
import { Box, ChakraProvider, Container } from "@chakra-ui/react";
import { Header, Footer } from '../components';




function MyApp({ Component, pageProps }) {
  return (
    <Box>

      <ChakraProvider>
        <Container
          boxShadow="md"
          padding={5}
          marginY={5}
          height="100vh"
          maxWidth="container.xl"
          justifyContent="center"
          alignItems="center"
          borderRadius={15}>
          <Header />
          <Component  {...pageProps} />
          <Footer />
        </Container>
      </ChakraProvider>
    </Box>
  );
}

export default MyApp;