import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';

let access_key = 'BF48A73439D7BF9676337F97DBCB9929B959D8D3CB7982BD6512DC2FA023267A'
let tokenBase64 = 'QkY0OEE3MzQzOUQ3QkY5Njc2MzM3Rjk3REJDQjk5MjlCOTU5RDhEM0NCNzk4MkJENjUxMkRDMkZBMDIzMjY3QQ==';
const uri = 'https://api.iugu.com/v1/retrieve_subaccounts_api_token';
const access = "retrieve_subaccounts_api_token";

/* let token = localStorage.getItem('token') || access_key;
if(token){
  token = token.replace(/['"]+/g, '');
}
console.log(token); */

export function createApollo(httpLink: HttpLink){
  return {
      link: httpLink.create({uri}),
      cache: new InMemoryCache(),
  };
}

export function provideApollo(httpLink: HttpLink) {
    const basic = setContext((operation, context) => ({
        headers: {
          Accept: 'charset=utf-8'
        }
      }));
      /* `Bearer ${token}` */
      /* Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Imhhc2giOiJGQzFDOEFCMy1BNjc3LUEzQzMtMkE5M0VFMkM2RjhBNTE2RCJ9LCJpYXQiOjE2MzcxOTIyNjMsImV4cCI6MTY0NDk2ODI2M30.aRXRnl9YAHPiGdxS_VZq9jVRxILeW0VzM4LhhgfIOqU` */
      const API_KEY = setContext((operation, context) => ({
        headers: {
          apitoken: access_key,
          Authorization: `Basic ${tokenBase64}`,
        },
      }));
    
      const link = ApolloLink.from([basic, API_KEY, httpLink.create({ uri })]);
      const cache = new InMemoryCache();
      
      console.log(link, cache);
      return {
        link,
        cache
      }
}


@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: provideApollo,
    deps: [HttpLink]
  },
]
})
export class AuthenticationModule {}