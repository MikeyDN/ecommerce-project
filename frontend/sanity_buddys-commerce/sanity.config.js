import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'buddys-commerce',
  basePath: '/studio',

  projectId: '1u3avr4h',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
// export default defineConfig({
//   name: 'default',
//   title: 'buddys-commerce',

//   projectId: 'jntrlq2c',
//   dataset: 'production',

//   plugins: [deskTool(), visionTool()],

//   schema: {
//     types: schemaTypes,
//   },
// })
