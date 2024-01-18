/* eslint-disable-next-line */
/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface Error {
    message: string;
    cause?: (string | { message?: string; detail?: string | { message?: string } })[];
    stack?: string;
  }
}
