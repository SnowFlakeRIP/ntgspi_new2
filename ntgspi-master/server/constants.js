const documentType = {
    1: 'Доп. образование несовершеннолетних',
    2: 'Доп. образование совершеннолетних',
    3: 'Повышение квалификации',
    4: 'Профессиональная переподготовка',
    5: 'Согласие на обработку персональных данных совершеннолетних',
    6: 'Согласие на обработку персональных данных несовершеннолетних',
    7: 'Заявление на КПК и ПП',

    DOPWithLess18: 1,
    DOPWithCustomer: 2,
    increaseQualify: 3,
    profReset: 4,
    personalDataToLess18: 5,
    personalDataToMore18: 6,
    KPKAndPP: 7
}

module.exports = {
    documentType: documentType
}