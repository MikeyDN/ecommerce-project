export default {
    name: 'product',
    title: 'Products',
    type: 'document',
    fields: [
        {
            name: 'image',
            title: 'Image',
            type: 'array',
            of: [{ type: 'image', options: {
                hotspot: true,
            } }],
            
        },
        {
            name: 'name',
            title: 'Name',
            type: 'string'
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 90
            }
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number'
        },
        {
            name: 'categories',
            type: 'array',
            title: 'Categories',
            of: [
                {
                    title: 'Category',
                    name: 'category',
                    type: 'reference',
                    to: [{ type: 'category' }]
                }
            ]
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text'
        }
        

    ]
}