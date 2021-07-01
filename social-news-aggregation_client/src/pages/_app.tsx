import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:1330/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ChakraProvider>
  );
}

export default MyApp;
