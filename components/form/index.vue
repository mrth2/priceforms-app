<script setup lang="ts">
const graphql = useStrapiGraphQL();
const subDomain = useSubDomain();
async function fetchData() {
  return await graphql(`
    # Write your query or mutation here
    fragment Image on UploadFileEntityResponse {
      data {
        attributes {
          url
        }
      }
    }
    fragment Flow on FormCategoryFlowEntityResponse {
      data {
        id
      }
    }
    query Form {
      forms(filters: {subDomain: {eq: "${subDomain}"}}) {
        data {
          id
          attributes {
            title
            zip {
              ... on ComponentPriceFormText {
                id
                hint
              }
              ... on ComponentPriceFormZipCode {
                id
                code
              }
            }
            button {
              promo
              return
              joining
            }
            registerForm {
              title
              description
              progress
              placeholder {
                firstName
                lastName
                email
                phone
              }
            }
            introBanner {
              text
              media {
                ...Image
              }
            }
            thankyouBanner {
              text
              media {
                ...Image
              }
            }
          }
        }
      }  
      categories: formCategories(filters: {form: {subDomain:{eq: "${subDomain}"}}}) {
        data {
          attributes {
            title
            icon {
              data {
                attributes {
                  url
                }
              }
            }
            iconActive {                
              data {
                attributes {
                  url
                }
              }
            }
            startFlow {
              ...Flow
            }
          }
        }
      }
      flows: formCategoryFlows(filters:{form: {subDomain: {eq: "${subDomain}"}}}) {
        data {
          attributes {
            name
            questions {
              title
              type
              question
              description          
              showEstimate
              canSelectMulti
              hasNext
              nextButtonOnTop
              options {
                value
                icon {
                  ...Image
                }
                iconActive {
                  ...Image
                }
                minPrice
                maxPrice
                currency
                discountPercent
                nextFlow {
                  ...Flow
                }
              }
              otherwiseFlow {
                ...Flow
              }
            }
          }
        }
        meta {
          pagination {
            page
            total
            pageSize
            pageCount
          }
        }
      }
    }
  `);
}
const { data } = await useAsyncData<any>("forms", () => {
  return fetchData();
});
</script>
<template>
  <div class="text-sm h-screen p-4">
    <!-- <img src="~/assets/images/home.jpeg" class="h-full object-cover" /> -->
    <code>
      <pre v-text="JSON.stringify(data.data.flows, undefined, '\t')" />
    </code>
  </div>
</template>
