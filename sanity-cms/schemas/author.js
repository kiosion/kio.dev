export default {
	name: 'author',
	title: 'Authors',
	type: 'document',
	fields: [
		{
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: Rule => Rule.required(),
		},
		{
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'name',
				maxLength: 96
			},
			validation: Rule => Rule.required(),
		},
		{
			name: 'image',
			title: 'Image',
			type: 'image',
			options: {
				hotspot: true
			}
		},
		{
			name: 'bio',
			title: 'Bio',
			type: 'text',
			rows: 2,
			validation: Rule => Rule.required(),
		},
		{
			name: 'body',
			title: 'Body',
			type: 'array',
			of: [
				{ type: 'block' },
				{ type: 'image' },
			],
			validation: Rule => Rule.required(),
		},
	],
	preview: {
		select: {
			title: 'name',
			media: 'image'
		}
	}
}
