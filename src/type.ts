type Country = {
    name: string,
    code: string,
    capital: string,
    region: string,
    currency: {
      code: string,
      name: string,
      symbol: string
    },
    language: {
      code: string,
      name: string
    },
    flag: string,
    dialling_code: string,
    isoCode: string
}

export {Country}