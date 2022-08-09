/* eslint-disable react/prop-types */
import S from '@sanity/desk-tool/structure-builder';
import React from 'react';

import {
  BsPersonFill,
  BsFillFileRichtextFill,
  BsFillFileImageFill,
  BsFillTagsFill
} from 'react-icons/bs';

const JsonPreview = ({ document }) => (
  <>
    <pre>{JSON.stringify(document.displayed, null, 2)}</pre>
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
        .child(S.documentTypeList('tag'))
    ]);
