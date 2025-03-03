import { currentOrg } from '@/utils';
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { AUTH_TOKEN } from "./constants";
import { onError } from '@apollo/client/link/error'; //
import { message } from 'antd';

// let uri = `http://${window.location.hostname}:8000/graphql`
// if (import.meta.env.NODE_ENV === 'production') {
//   uri = `https://${window.location.hostname}:8000/graphql`
// }

const uri = '/graphql';
const httpLink = createHttpLink({
  uri,
})

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
      orgId: currentOrg()?.value
    }
  }
})


const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    message.error('請求參數或者返回的數據格式不對');
    graphQLErrors.forEach((item) => {
      if (item.message === 'Unauthorized') {
        message.destroy()
        message.error('登錄失敗，請重新登錄');
      }
      return
    });
  }

  if (networkError) {
    message.error(networkError.message);
  }
});


export const client = new ApolloClient({
  // uri: 'http://localhost:3000/graphql',
  // uri: 'http://localhost:7777/graphql',
  link: errorLink.concat(authLink.concat(httpLink)),

  /*建議將Apollo的緩存關閉，當資料在做API更新時，若沒有關閉，可能會發生一些無法即時刷新的狀況，
  造成需要手動refresh頁面才能刷新資料*/
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  },
  cache: new InMemoryCache({
    addTypename: false // addTypename設置為false時，graphql返回到前端的物件資料裡就不會加帶__typenam的屬性
  })
})
