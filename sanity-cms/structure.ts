import {
  BsPersonFill,
  BsFillFileRichtextFill,
  BsFillFileImageFill,
  BsFillTagsFill,
  BsGearFill,
  BsListUl,
  BsFillFileTextFill,
  BsFillFileEarmarkTextFill
} from 'react-icons/bs';
import { BiLinkExternal } from 'react-icons/bi';
import type { StructureBuilder, StructureResolverContext } from 'sanity/desk';

export const structure = (
  S: StructureBuilder,
  context: StructureResolverContext
) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Global Settings')
        .icon(BsGearFill)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Global Settings')
        ),
      S.listItem()
        .title('Me')
        .icon(BsPersonFill)
        .child(S.document().title('Me').schemaType('author').documentId('me')),
      S.divider(),
      S.listItem()
        .title('Posts')
        .icon(BsFillFileRichtextFill)
        .child(
          S.list()
            .title('Posts')
            .items([
              S.listItem()
                .title('Published')
                .icon(BsFillFileTextFill)
                .child(
                  S.documentTypeList('post')
                    .title('Published')
                    .filter('_type == "post" && !(_id in path("drafts.**"))')
                ),
              S.listItem()
                .title('Drafts')
                .icon(BsFillFileEarmarkTextFill)
                .child(
                  S.documentTypeList('post')
                    .title('Drafts')
                    .filter('_type == "post" && _id in path("drafts.**")')
                ),
              S.divider(),
              S.listItem()
                .title('All Posts')
                .icon(BsListUl)
                .child(S.documentTypeList('post'))
            ])
        ),
      S.listItem()
        .title('Projects')
        .icon(BsFillFileImageFill)
        .child(
          S.list()
            .title('Projects')
            .items([
              S.listItem()
                .title('Writeups')
                .icon(BsFillFileTextFill)
                .child(
                  S.documentTypeList('project')
                    .title('Writeups')
                    .filter('_type == "project" && !external')
                ),
              S.listItem()
                .title('External')
                .icon(BiLinkExternal)
                .child(
                  S.documentTypeList('project')
                    .title('External')
                    .filter('_type == "project" && external == true')
                ),
              S.divider(),
              S.listItem()
                .title('All Projects')
                .icon(BsListUl)
                .child(S.documentTypeList('project'))
            ])
        ),
      S.listItem()
        .title('Tags')
        .icon(BsFillTagsFill)
        .child(S.documentTypeList('tag'))
    ]);
