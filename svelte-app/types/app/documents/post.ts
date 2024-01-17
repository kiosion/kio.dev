import type { Document, DocumentHeadings, DocumentTags } from '$types/documents';

export interface PostDocument extends Document {
  _type: 'post';
  headings: DocumentHeadings[];
  desc?: string;
  tags?: DocumentTags[];
  title: string;
}
