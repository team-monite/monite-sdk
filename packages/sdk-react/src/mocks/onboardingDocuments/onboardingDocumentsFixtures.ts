import {
  AllowedCountries,
  OnboardingDocumentsDescriptions,
} from '@monite/sdk-api';

export const getOnboardingDocumentDescriptionByCountry = (
  country: AllowedCountries
): OnboardingDocumentsDescriptions => {
  switch (country) {
    case AllowedCountries.DE:
      return {
        additional_verification: ['Meldebescheinigung', 'Führerschein'],
        entity_verification: ['Handelsregisterauszug', 'Gewerbeanmeldung'],
        verification: ['Personalausweisnummer', 'Biometrische Verifikation'],
      };

    case AllowedCountries.ES:
      return {
        additional_verification: [
          'Factura de servicios para comprobación de dirección',
          'Carné de conducir',
        ],
        entity_verification: [
          'Documento de constitución de la empresa',
          'CIF de la empresa',
        ],
        verification: [
          'Número de identidad de extranjero (NIE)',
          'Verificación biométrica',
        ],
      };

    default:
      return {
        additional_verification: [
          'Utility bill for address proof',
          "Driver's license",
        ],
        entity_verification: [
          'Articles of Incorporation',
          'IRS EIN Confirmation Letter',
        ],
        verification: ['Social Security Number', 'Biometric Verification'],
      };
  }
};
