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
			name: 'himage',
			title: 'Header Image',
			type: 'image',
			options: {
				hotspot: false,
			},
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
			name: 'body',
			title: 'Body',
			type: 'array',
			of: [{ type: 'block' }],
			validation: Rule => Rule.required(),
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
