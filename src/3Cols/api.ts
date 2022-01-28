import { AxiosResponse, AxiosError, Axios, AxiosRequestConfig, Method } from 'axios';
import { Board } from './objects/board';
import { BoardListResponse } from './objects/boardListResponse';
import orderBy = require('lodash.orderby');
import { Category } from './objects/category';
import { Subcategory } from './objects/subcategory';
import { Snippet } from './objects/snippet';

const axios = require('axios').default;

export class ThreeColsAPI {

  private getRequestOptions(apiKey: string, url: string, method: string): AxiosRequestConfig {
    return {
      baseURL: 'https://3cols.com/api/public',
      url: url,
      method: method as Method,
      timeout: 20000,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'X-API-KEY': apiKey
      }
    };
  }

  public getBoards(apiKey: string): Promise<Board[]> 
  { 
    const options = this.getRequestOptions(apiKey, '/board/list', 'GET');

    return axios(options).then((resp: AxiosResponse) => {
      const boardResponse = resp.data as BoardListResponse;
      const boards = boardResponse.ownedBoards.concat(boardResponse.sharedBoards).concat(boardResponse.organisationBoards);
      return orderBy(boards, "boardName");
    });
  }

  public getCategories(apiKey: string, boardID: string): Promise<Category[]> 
  { 
    const options = this.getRequestOptions(apiKey, `/category/list?boardID=${boardID}`, 'GET');

    return axios(options).then((resp: AxiosResponse) => {
      return orderBy(resp.data as Category[], "name");
    });
  }

  public getSubcategories(apiKey: string, categoryID: string): Promise<Subcategory[]> {
    const options = this.getRequestOptions(apiKey, `/subcategory/list?categoryID=${categoryID}`, 'GET');

    return axios(options).then((resp: AxiosResponse) => {
      return orderBy(resp.data as Subcategory[], "name");
    });
  }

  public getSnippets(apiKey: string, subcategoryID: string): Promise<Snippet[]> {
    const options = this.getRequestOptions(apiKey, `/snippet/list?subcategoryID=${subcategoryID}`, 'GET');

    return axios(options).then((resp: AxiosResponse) => {
      return orderBy(resp.data as Snippet[], "name");
    });
  }

  public updateSnippet(apiKey: string, snippet: Snippet): void {
    const options = this.getRequestOptions(apiKey, '/snippet/update', 'PUT');
    options.data = snippet;
    return axios(options);
  }

  public addSnippet(apiKey: string, snippet: Snippet): void {
    const options = this.getRequestOptions(apiKey, '/snippet/add', 'POST');
    delete (snippet as any).snippetID;
    options.data = snippet;
    return axios(options);
  }
}