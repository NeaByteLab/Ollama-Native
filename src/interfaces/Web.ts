/**
 * Interface for web fetch request.
 * @description Request object for web fetch.
 */
export interface WebFetchRequest {
  /** The URL to fetch */
  url: string
}

/**
 * Interface for web fetch response.
 * @description Response object for web fetch.
 */
export interface WebFetchResponse {
  /** The content of the fetched content */
  content: string
  /** The links of the fetched content */
  links: string[]
  /** The title of the fetched content */
  title: string
  /** The URL of the fetched content */
  url: string
}

/**
 * Interface for web search request.
 * @description Request object for web search.
 */
export interface WebSearchRequest {
  /** The maximum number of results to return */
  max_results?: number
  /** The query to search for */
  query: string
}

/**
 * Interface for web search result.
 * @description Result object for web search.
 */
export interface WebSearchResult {
  /** The content of the search result */
  content: string
}

/**
 * Interface for web search response.
 * @description Response object for web search.
 */
export interface WebSearchResponse {
  /** The results of the search */
  results: WebSearchResult[]
}
