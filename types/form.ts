import { IMedia } from "./media"
import { IUser } from "./user"

export interface IForm {
  id: number
  title: string
  subDomain: string
  introBanner: {
    text: string
    media: IMedia
  }
  thankyouBanner: {
    text: string
    media: IMedia
  }
  zip: Array<{
    hint?: string
    code?: string
  }>
  button: {
    joining: string
    return: string
    promo: string
  }
  term: string
  registerForm: {
    title: string
    description: string
    placeholder: {
      firstName: string
      lastName: string
      phone: string
      email: string
    }
    button: string
    progress: string
  }
  categoryForm: {
    title: string
    progress: string
  }
  categories: IFormCategory[]
  logo: IMedia
  favicon: IMedia
  theme: 'catania' | null
  homeStyle: 'reviewBottom' | 'reviewRight'
  socialLinks: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
    linkedin: string
  }
  footer: {
    policy: string
    sitemap: string
    disclaimer: string
    copyright: string
  }
}

export interface IFormCategory {
  id: number
  title: string
  icon: IMedia
  iconActive: IMedia
  form: IForm
  startFlow: IFormCategoryFlow
  createdAt: string
  updatedAt: string
}

interface IPricing {
  minPrice: number
  maxPrice: number
  currency: 'usd' | 'gbp' | 'eur'
}

export interface IFormQuestionOption extends IPricing {
  id: number
  value: string
  icon: IMedia
  iconActive: IMedia
  discountPercent: number
  nextFlow: IFormCategoryFlow
}

export interface IFormQuestion {
  title: string
  question: string
  type: 'yes_no' | 'yes_no_icon' | 'date_picker' | 'icon_list'
  description: string
  showEstimate: boolean
  hasNext: boolean
  nextButtonOnTop: boolean
  canSelectMulti: boolean
  options: IFormQuestionOption[]
  otherwiseFlow: IFormCategoryFlow
}

export interface IFormCategoryFlow {
  id: number
  name: string
  questions: IFormQuestion[]
  form: IForm
  category: IFormCategory
}

export interface IFormSubmission extends IPricing {
  id: number
  zip: string
  user: IUser
  form: IForm
  category: IFormCategory
  status: 'register' | 'partial' | 'complete'
  progress: number
  stopAt: string
  data: Array<{
    fid: number
    qid: number
    oid?: number
    title: string
    question: string
    answer: string
    at: string
  }>
  dataPath: string
  createdAt: string
  updatedAt: string
}