// src/lib/queries.js

export const headerQuery = `
  *[_type == "header"][0]{
    logo{
      asset->{
        url
      }
    },
    availableLanguages,
    navlinks[]{
      url,
      text_en,
      text_fr,
      text_ar
    },
    mainButton{
      url,
      text_en,
      text_fr,
      text_ar
    }
  }
`;


export const heroQuery = `
  *[_type == "heroSection"][0]{
    typeOfWork{
      en,
      fr,
      ar
    },
    hello{
      en,
      fr,
      ar
    },
    iAm{
      en,
      fr,
      ar
    },
    name{
      en,
      fr,
      ar
    },
    job{
      en,
      fr,
      ar
    },
    image{
      asset->{
        url
      }
    }
  }
`;


export const aboutQuery = `
  *[_type == "aboutSection"][0]{
    subtitle{
      en,
      fr,
      ar
    },
    title{
      en,
      fr,
      ar
    },
    paragraph{
      en,
      fr,
      ar
    },
    services[]{
      en,
      fr,
      ar
    },
    contacts{
      emailLabel{
        en,
        fr,
        ar
      },
      email,
      phoneLabel{
        en,
        fr,
        ar
      },
      phone
    },
    mainImage{
      asset->{
        url
      }
    },
    badge1{
      text{
        en,
        fr,
        ar
      },
      iconImage{
        asset->{
          url
        }
      }
    },
    badge2{
      text{
        en,
        fr,
        ar
      },
      iconImage{
        asset->{
          url
        }
      }
    }
  }
`;

export const servicesQuery = `
  *[_type == "servicesSection"][0]{
    subtitle{
      en,
      fr,
      ar
    },
    title{
      en,
      fr,
      ar
    },
    services[]{
      title{
        en,
        fr,
        ar
      },
      description{
        en,
        fr,
        ar
      },
      icon{
        asset->{
          url
        }
      }
    }
  }
`;

export const skillsSection = `
  *[_type == "skillsSection"][0]{
    subtitle{
      en,
      fr,
      ar
    },
    title{
      en,
      fr,
      ar
    },
    description{
      en,
      fr,
      ar
    },
    button{
      text{
        en,
        fr,
        ar
      },
      url
    },
    cards[]{
      title,
      image{
        asset->{
          url
        }
      }
    }
  }
`;

export const workQuery = `
*[_type == "workSection"][0]{
  subtitle { en, fr, ar },
  title { en, fr, ar },

  button {
    text { en, fr, ar },
    url
  },

  projects[]->{
    _id,
    title { en, fr, ar },
    subtitle { en, fr, ar },
    description { en, fr, ar },
    category { en, fr, ar },
    image,
    slug,
    order,
    featured
  }
}
`;


export const clientsTestimonialsQuery = `
  *[_type == "clientsTestimonials"][0]{
    subtitle {
      en,
      fr,
      ar
    },
    title {
      en,
      fr,
      ar
    },
    description {
      en,
      fr,
      ar
    },
    testimonials[] {
      clientName,
      gender,
      projectType,
      message,
      avatar {
        asset->{
          url
        }
      }
    }
  }
`;

export const pricingQuery = `
  *[_type == "pricingSection"][0]{
    subtitle { en, fr, ar },
    title { en, fr, ar },
    cards[] {
      iconType,
      iconSvg,
      iconImage {
        asset->{ url }
      },
      cardTitle { en, fr, ar },
      cardSubtitle { en, fr, ar },
      description { en, fr, ar },
      price,
      timeline
    }
  }
`;

export const contactSectionQuery = `
  *[_type == "contactSection"][0]{
    badge {
      en,
      fr,
      ar
    },
    title {
      en,
      fr,
      ar
    },
    description {
      en,
      fr,
      ar
    },
    features[]{
      text {
        en,
        fr,
        ar
      }
    },
    formLabels {
      fullName {
        en,
        fr,
        ar
      },
      email {
        en,
        fr,
        ar
      },
      phone {
        en,
        fr,
        ar
      },
      subject {
        en,
        fr,
        ar
      },
      message {
        en,
        fr,
        ar
      }
    },
    buttonText {
      en,
      fr,
      ar
    }
  }
`;


export const footerQuery = `
  *[_type == "footer"][0]{
    logo{
      asset->{
        url
      }
    },

    quickLinksTitle{
      en,
      fr,
      ar
    },

    quickLinks[]{
      label{
        en,
        fr,
        ar
      },
      url
    },

    addressTitle{
      en,
      fr,
      ar
    },

    addressText{
      en,
      fr,
      ar
    },

    email,
    phone
  }
`;

export const subFooterQuery = `
  *[_type == "subFooter"][0]{
    copyright{
      en,
      fr,
      ar
    },
    brand,
    socials[]{
      label{
        en,
        fr,
        ar
      },
      url
    }
  }
`;


export const animatedBarQuery = `
  *[_type == "animatedBar"][0]{
    words[]{
      en,
      fr,
      ar
    }
  }
`;

export const projectsPageQuery = `
*[_type == "projectsPage"][0]{
  heroTitle,
  filters,
  "projects": projects[]->{
    _id,
    projectId,
    title,
    category,
    image,
    order,
    mainImage,
  }
}
`;

export const relatedProjectsQuery = `*[_type == "workSection"][0]{
  projects[0...3]->{
  _id,
    title { en, fr, ar },
    category { en, fr, ar },
    image
  }
}`;












