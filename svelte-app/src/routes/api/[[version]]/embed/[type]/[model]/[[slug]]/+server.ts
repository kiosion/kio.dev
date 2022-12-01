import type { RequestHandler, RequestEvent } from './$types';
import { REMOTE_API_URL } from '$lib/env';
import { fetchRemote } from '$lib/data.server';
import { fionaPlaceholder } from '$helpers/placeholders';
import nodeHtmlToImage from 'node-html-to-image';
// import type { AuthorDocument } from '$types';
// import { urlFor, getCrop } from '$helpers/image';

export const GET: RequestHandler = async ({
  url,
  params
}): Promise<Response> => {
  const { type, model, slug } = params;
  const lang = url.searchParams.get('lang') || 'en';

  if (
    !['opengraph', 'twitter'].includes(type) ||
    !['page', 'post', 'project'].includes(model) ||
    !slug
  ) {
    return new Response(
      JSON.stringify({ code: 400, message: 'Invalid request' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  switch (model) {
    case 'page':
      return await generatePageEmbed({ type, page: slug, lang });
  }

  return new Response(
    JSON.stringify({
      code: 200,
      message: 'Success',
      data: {
        type,
        model,
        slug
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

// const generateDocumentEmbed = async (
//   type: string,
//   model: string,
//   slug: string
// ) => {};

// const generateAuthorEmbed = async (type: string) => {
//   const endpoint = `${REMOTE_API_URL}/query/about`,
//     remoteRes = await fetchRemote({ endpoint });

//   if (remoteRes instanceof Error || !remoteRes?.data) {
//     return new Response(
//       JSON.stringify({
//         code: 500,
//         error: remoteRes.message || 'Internal server error'
//       }),
//       {
//         headers: {
//           'content-type': 'application/json; charset=utf-8'
//         }
//       }
//     );
//   }

//   const data = remoteRes.data as unknown as AuthorDocument,
//     { name, bio, image } = data;

//   const html = `
//     <html>
//       <style>
//         html, body {
//           background-color: transparent;
//         }
//         body {
//           position: relative;
//           margin: 0;
//           padding: 0;
//           font-family: 'Inter', sans-serif;
//           font-size: 1.25rem;
//           line-height: 1.5;
//           color: #fff;
//           width: 1200px;
//           height: 630px;
//         }
//         img {
//           width: 120px;
//           height: 120px;
//           border-radius: 50%;
//           object-fit: cover;
//           border: 1px solid #000;
//         }
//         .container {
//           display: flex;
//           flex-direction: row;
//           justify-content: center;
//           align-items: center;
//           width: 100%;
//           height: 100%;
//           gap: 2rem;
//           background-color: #000;
//           border-radius: 1rem;
//         }
//       </style>
//       <body>
//         <div class="container">
//           <img src={{imageSrc}} />
//           <h1>{{name}}</h1>
//         </div>
//       </body>
//     </html>
//   `,
//     imageCrop = getCrop(image),
//     imageSrc = urlFor(image.asset._ref)
//       .size(110, 110)
//       .rect(imageCrop.left, imageCrop.top, imageCrop.width, imageCrop.height)
//       .fit('crop')
//       .format('webp')
//       .url();

//   const b64 = (await nodeHtmlToImage({
//     html,
//     type: 'png',
//     content: {
//       name,
//       imageSrc
//     },
//     transparent: true
//   })) as string;

//   return new Response(b64, {
//     status: 200,
//     headers: {
//       'content-type': 'image/png'
//     }
//   });
// };

const generatePageEmbed = async ({
  type,
  page,
  lang
}: {
  type: string;
  page: string;
  lang: string;
}) => {
  let html: string | undefined;

  const pageTitle =
      page === 'index' ? 'Home' : page.charAt(0).toUpperCase() + page.slice(1),
    { width, height } =
      type === 'opengraph'
        ? { width: 1200, height: 630 }
        : { width: 800, height: 418 };

  if (type === 'opengraph') {
    html = `
      <html>
        <style>
          body {
            position: relative;
            margin: 0;
            padding: 24px;
            background: #0f172a;
            width: {{width}}px;
            height: {{height}}px;
          }
          .container {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 100%;
            background-color: #1e293b;
            border-radius: 36px;
          }
          .inner {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-start;
            width: calc(100% - 52px);
            height: calc(100% - 48px);
            padding: 24px 26px;
          }
          .title, .pageTitle {
            margin: 0;
            padding: 0;
            z-index: 1;
            color: #000;
            font-family: 'Inter', sans-serif;
            font-weight: 800;
            font-size: 2.0rem;
          }
          .fiona-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.75;
            z-index: 0;
          }
        </style>
        <body>
          <div class="container">
            <div class="inner">
              <p class="title">kio.dev</p>
              <p class="pageTitle">{{page}}</p>
            </div>
            <img class="fiona-bg" src={{fionaBg}} />
          </div>
        </body>
      </html>
    `;
  } else {
    html = `
      <html>
        <style>
          html, body {
            background-color: transparent;
          }
          body {
            position: relative;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            font-size: 1.25rem;
            line-height: 1.5;
            color: #fff;
            width: 
          }
          .container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            gap: 2rem;
            background-color: #000;
            border-radius: 1rem;
          }
        </style>
        <body>
          <div class="container">
            <h1>{{page}}</h1>
          </div>
        </body>
      </html>
    `;
  }

  const b64 = (await nodeHtmlToImage({
    html,
    type: 'png',
    content: {
      page: pageTitle,
      fionaBg: fionaPlaceholder(page),
      width,
      height
    },
    transparent: true
  })) as string;

  return new Response(b64, {
    status: 200,
    headers: {
      'content-type': 'image/png'
    }
  });
};
