import {translate} from "./translate";
import * as T from "./types";

const testQuery1: T.ITranslateParams = {
    text: 'my name is john cena',
    // from: '',
    to: 'ru'

}

const testQuery2: T.ITranslateParams = {
    text: 'В принципе, если не спать, то успею',
    // from: 'ru',
    to: 'tt'

}

const testQuery3: T.ITranslateParams = {
    text: 'Hi, translator, I\'m dad',
    // from: '',
    to: ''

}

describe('Testing translate.ts', () => {
    test('Translations', () => {
        expect(translate(testQuery1)).toBe("меня зовут джон сина")
        expect(translate(testQuery2)).toBe("Асылда, йокламыйм икән, вакытым булыр")
        expect(translate(testQuery3)).toBe("Привет, переводчик, я папа")
    })
})