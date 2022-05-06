export default {
	name: 'siteimages',
	title: 'Site Images',
	type: 'document',
	fields: [
		{
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: Rule => Rule.required(),
		},
		{
			name: 'image',
			title: 'Image',
			type: 'image',
			options: {
				hotspot: false,
			},
			validation: Rule => Rule.required(),
		},
	],
}
