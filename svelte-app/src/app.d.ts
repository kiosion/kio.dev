/* eslint-disable-next-line */
/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface Error {
    message: string;
    stack?: string;
  }
}
