import { NgModule } from "@angular/core";
import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HTTP } from '@ionic-native/http/ngx';
import {ApolloLink, FetchResult, NextLink, Observable, Operation} from '@apollo/client/core';
//Substitui o @apollo/client = para solucionar o erro Handler, para o 'apollo-link'.
/* import {
    ApolloLink,
    Observable as LinkObservable,
    Operation,
    FetchResult,
} from 'apollo-link'; */
import { HttpHeaders } from "@angular/common/http";

const uri = 'https://api.iugu.com/v1/';

export function createApollo(httpLink: HttpLink){
    return {
        link: httpLink.create({uri}),
        cache: new InMemoryCache(),
    };
}

@NgModule({
    exports: [ApolloModule, HttpLinkModule],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
    ],
})

export class Apollo_Module{}