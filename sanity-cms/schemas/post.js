export default {
	name: 'blogposts',
	title: 'Blog Posts',
	type: 'document',
	fields: [
		{
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: Rule => Rule.required(),
		},
		{
			name: 'slug',
			title: 'URL Slug',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96,
			},
			validation: Rule => Rule.required(),
		},
		{
			name: 'author',
			title: 'Author',
			type: 'reference',
			to: {type: 'author'},
		},
		{
			name: 'himage',
			title: 'Header Image',
			type: 'image',
			options: {
				hotspot: true,
			},
		},
		{
			name: 'desc',
			title: 'Description',
			type: 'text',
		},
		{
			name: 'date',
			title: 'Date',
			type: 'date',
			options: {
				dateFormat: 'MMMM Do, YYYY',
			},
			initialValue: () => new Date(),
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
			of: [
				{
					name: 'tag',
					title: 'Tag',
					type: 'string',
				},
			],
		},
	],
}
