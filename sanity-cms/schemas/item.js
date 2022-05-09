export default {
	name: 'item',
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
			name: 'pimage',
			title: 'Preview',
			type: 'image',
			options: {
				hotspot: true,
			},
			validation: Rule => Rule.required(),
		},
		{
			name: 'desc',
			title: 'Description',
			type: 'text',
			rows: 2,
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
			name: 'category',
			title: 'Category',
			type: 'string',
			options: {
				list: [
					{ title: 'Design', value: 'design' },
					{ title: 'Development', value: 'development' },
				],
			},
		},
		{
			name: 'priority',
			title: 'Priority',
			type: 'number',
			options: {
				min: 0,
			},
			validation: Rule => Rule.required(),
		}
	]
}
