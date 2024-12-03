// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import English from "./eng.json";
import Vietnamese from "./vie.json";

const resources = {
    eng: { translation: English },
    vie: { translation: Vietnamese },
};

const savedLanguage = sessionStorage.getItem('language') || 'eng';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'eng',
        keySeparator: false,
        interpolation: { escapeValue: false },
    }, () => {
        console.log('Initial language:', i18n.language);
    });

export default i18n;
