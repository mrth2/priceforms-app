export const ImageFragment = `
  fragment Image on UploadFileEntityResponse {
    data {
      attributes {
        url
      }
    }
  }
`;

export const FlowFragment = `
  fragment Flow on FormCategoryFlowEntityResponseCollection {
    data {
      id
      attributes {
        name
        category {
          data {
            id
          }
        }
        questions(pagination:{pageSize: 50}) {
          id
          title
          description
          type
          question
          options(pagination:{pageSize: 20}) {
            id
            value
            minPrice
            maxPrice
            currency
            discountPercent
            bonusPercent
            icon {
              ...Image
            }
            iconActive {
              ...Image
            }
            nextFlow {
              data {
                id
              }
            }
            endOfFlow
          }
          hasNext
          nextButtonOnTop
          backButtonOnBottom
          showEstimate
          canSelectMulti
          canSelectNone
          otherwiseFlow {
            data {
              id
            }
          }
        }
      }
    }
  }
`;