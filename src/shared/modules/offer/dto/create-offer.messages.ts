export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  city: {
    invalid:
      'city must be one of the following: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  previewImage: {
    minLength: 'Too short for field «image»',
  },
  images: {
    invalidFormat: 'Field images must be an array',
    minLength: 'Too short for image',
  },
  isPremium: {
    invalid: 'This field must be false or true',
  },
  propertyType: {
    invalid: 'Property type must be one of the valid types',
  },
  rooms: {
    invalidFormat: 'Rooms must be an integer',
    minValue: 'Minimum rooms is 1',
    maxValue: 'Maximum rooms is 8',
  },
  guests: {
    invalidFormat: 'Guests must be an integer',
    minValue: 'Minimum guests is 1',
    maxValue: 'Maximum guests is 10',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  supplies: {
    invalidFormat: 'Field supplies must be an array',
    invalidType: 'Supplies field must be an array of valid supplies',
  },
  location: {
    invalidFormat:
      'location supplies must be an object which is including latitude, longitude',
    invalidType: 'Location field must be an object with valid coordinates',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
} as const;
