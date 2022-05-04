export default {
	name: 'portfolioitems',
	title: 'Portfolio Items',
	type: 'document',
	fields: [
		{
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: Rule => Rule.required(),
		},
		{
			name: 'url',
			title: 'URL Slug',
			type: 'string',
			validation: Rule => Rule.required(),
		},
		{
			name: 'desc',
			title: 'Description',
			type: 'text',
			validation: Rule => Rule.required(),
		},
		{
			name: 'date',
			title: 'Date',
			type: 'date',
			options: {
				dateFormat: 'MMMM Do, YYYY',
			},
			initialValue: () => new Date(),
			validation: Rule => Rule.required(),
		},
		{
			name: 'pimage',
			title: 'Preview',
			type: 'image',
			options: {
				hotspot: true,
			},
			validation: Rule => Rule.required(),
		},
		{
			name: 'images',
			title: 'Images',
			type: 'array',
			of: [
				{
					type: 'image',
					options: {
						hotspot: false,
					},
				}
			]
		},
		{
			name: 'body',
			title: 'Body',
			type: 'array',
			of: [{ type: 'block' }],
		},
		{
			name: 'tags',
			title: 'Tags',
			type: 'array',
			of: [{ type: 'string' }],
			options: {
				list: [
					{ title: 'Art', value: 'art' },
					{ title: 'Design', value: 'design' },
					{ title: 'Music', value: 'music' },
					{ title: 'Development', value: 'development' },
					{ title: 'Blog Post', value: 'blog-post' },
				],
			},
		},
	],
}
