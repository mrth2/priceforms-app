export const MediaQuery = {
  fields: ['url']
};

const OnlyId = {
  fields: ['id']
};

export const FlowQuery = {
  ...OnlyId,
  populate: {
    category: OnlyId,
    questions: {
      fields: ['id', 'title', 'description', 'type', 'question', 'hasNext', 'nextButtonOnTop', 'backButtonOnBottom', 'showEstimate', 'canSelectMulti', 'canSelectNone'],
      populate: {
        options: {
          fields: ['id', 'value', 'minPrice', 'maxPrice', 'currency', 'discountPercent', 'bonusPercent', 'endOfFlow'],
          populate: {
            icon: MediaQuery,
            iconActive: MediaQuery,
            nextFlow: OnlyId
          },
          pagination: {
            pageSize: 20
          }
        },
        otherwiseFlow: OnlyId
      },
      pagination: {
        pageSize: 50
      }
    }
  }
};