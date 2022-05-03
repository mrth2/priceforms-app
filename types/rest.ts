export const MediaQuery = {
  fields: ['url']
};

const OnlyId = {
  fields: ['id']
};

export const FlowQuery = {
  ...OnlyId,
  fields: ['skipEstimation'],
  populate: {
    category: OnlyId,
    questions: {
      fields: ['id', 'title', 'description', 'type', 'question', 'hasNext', 'nextButtonOnTop', 'backButtonOnBottom', 'showEstimate', 'canSelectMulti', 'canSelectNone', 'showDividedPrice'],
      populate: {
        options: {
          fields: [
            'id', 'value', 'minPrice', 'maxPrice', 'currency',
            'unit', 'unitCapacity', 'isInput', 'dividePriceBy',
            'discountPercent', 'bonusPercent', 'endOfFlow'
          ],
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