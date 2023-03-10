export default {
    name: 'event',
    title: 'Event',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'location',
        title: 'Location',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'string',
      },
      {
        name: 'starts',
        title: 'Starts',
        type: 'datetime',
        validation: Rule => Rule.required()
      },
      {
        name: 'ends',
        title: 'Ends',
        type: 'datetime',
      },
      {
        name: 'url',
        title: 'Link',
        type: 'url',
      },
    ]
  }