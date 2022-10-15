/* eslint-disable */
import S from '@sanity/desk-tool/structure-builder';
import React from 'react';

import {
  BsPersonFill,
  BsFillFileRichtextFill,
  BsFillFileImageFill,
  BsFillTagsFill,
  BsGearFill,
  BsChatFill
} from 'react-icons/bs';

const JsonPreview = ({ document }) => (
  <>
    <pre style={{ marginLeft: '1rem' }}>
      {JSON.stringify(document.displayed, null, 2)}
    </pre>
  </>
);

export const getDefaultDocumentNode = () => {
  return S.document().views([
    S.view.form(),
    S.view.component(JsonPreview).title('JSON')
  ]);
};

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Settings')
        .icon(BsGearFill)
        .child(
          S.document()
            .title('Site Settings')
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .views([S.view.form(), S.view.component(JsonPreview).title('JSON')])
        ),
      S.divider(),
      S.listItem()
        .title('People')
        .icon(BsPersonFill)
        .child(S.documentTypeList('author')),
      S.listItem()
        .title('Posts')
        .icon(BsFillFileRichtextFill)
        .child(S.documentTypeList('post')),
      S.listItem()
        .title('Projects')
        .icon(BsFillFileImageFill)
        .child(S.documentTypeList('project')),
      S.listItem()
        .title('Tags')
        .icon(BsFillTagsFill)
        .child(S.documentTypeList('tag')),
      S.listItem()
        .title('Comments')
        .icon(BsChatFill)
        .child(S.documentTypeList('comment'))
    ]);
