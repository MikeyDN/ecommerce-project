export default {
    name: 'promoted',
    title: 'Promoted product',
    type: 'document',
    fields: [
        {
            name: 'smallTitle',
            title: 'Small Title',
            type: 'string',
        },
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            name: 'product',
            type: 'reference',
            to: [{ type: 'product' }],
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
    ],
  };