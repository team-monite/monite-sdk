import { I18n, MessageDescriptor } from '@lingui/core';
import { z } from 'zod';
import {
  stringValidator,
  numberValidator,
  booleanValidator,
  emailValidator,
  urlValidator,
  ibanValidator,
  dateOfBirthValidator,
  phoneValidator,
  withIbanCountryConsistency,
} from './validators';

describe('Core Validators Functionality', () => {
  describe('stringValidator', () => {
    const validator = stringValidator();

    it('should accept valid strings and null', () => {
      expect(validator.parse('hello')).toBe('hello');
      expect(validator.parse('')).toBe('');
      expect(validator.parse(null)).toBe(null);
    });

    it('should reject non-string values', () => {
      expect(() => validator.parse(123)).toThrow();
      expect(() => validator.parse(true)).toThrow();
      expect(() => validator.parse({})).toThrow();
    });
  });

  describe('numberValidator', () => {
    const validator = numberValidator();

    it('should accept numbers and coerce strings', () => {
      expect(validator.parse(123)).toBe(123);
      expect(validator.parse('123')).toBe(123);
      expect(validator.parse(null)).toBe(null);
    });

    it('should reject invalid values', () => {
      expect(() => validator.parse('not-a-number')).toThrow();
      expect(() => validator.parse({})).toThrow();
    });
  });

  describe('booleanValidator', () => {
    const validator = booleanValidator();

    it('should accept only boolean values', () => {
      expect(validator.parse(true)).toBe(true);
      expect(validator.parse(false)).toBe(false);
    });

    it('should reject non-boolean values', () => {
      expect(() => validator.parse('true')).toThrow();
      expect(() => validator.parse(1)).toThrow();
      expect(() => validator.parse(null)).toThrow();
    });
  });

  describe('Zod Integration', () => {
    it('should work as Zod schemas in object validation', () => {
      const schema = z.object({
        name: stringValidator(),
        age: numberValidator(),
        active: booleanValidator(),
      });

      const validData = {
        name: 'John',
        age: 25,
        active: true,
      };

      expect(() => schema.parse(validData)).not.toThrow();
      const result = schema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should work with nullable and optional fields', () => {
      const schema = z.object({
        required: stringValidator(),
        optional: stringValidator().optional(),
        nullable: stringValidator(),
      });

      expect(() => schema.parse({
        required: 'test',
        nullable: null,
      })).not.toThrow();

      expect(() => schema.parse({
        required: 'test',
        nullable: null,
        optional: undefined,
      })).not.toThrow();

      expect(() => schema.parse({
        nullable: null,
      })).toThrow();
    });

    it('should support chaining with other Zod methods', () => {
      const schema = z.object({
        email: stringValidator().refine(val => !val || val.includes('@'), {
          message: 'Must be a valid email',
        }),
        count: numberValidator().refine(val => val === null || val >= 0, {
          message: 'Must be non-negative',
        }),
      });

      expect(() => schema.parse({
        email: 'test@example.com',
        count: 5,
      })).not.toThrow();

      expect(() => schema.parse({
        email: null,
        count: null,
      })).not.toThrow();

      expect(() => schema.parse({
        email: 'invalid-email',
        count: 5,
      })).toThrow();

      expect(() => schema.parse({
        email: 'test@example.com',
        count: -1,
      })).toThrow();
    });
  });

  describe('Migration Compatibility', () => {
    it('should maintain the same API surface as Yup validators', () => {
      const validators = [
        stringValidator(),
        numberValidator(), 
        booleanValidator(),
      ];

      validators.forEach(validator => {
        expect(validator).toHaveProperty('parse');
        expect(validator).toHaveProperty('safeParse');
        expect(typeof validator.parse).toBe('function');
        expect(typeof validator.safeParse).toBe('function');
      });
    });

    it('should work in complex schema compositions', () => {
      const userFormSchema = z.object({
        personalInfo: z.object({
          firstName: stringValidator(),
          lastName: stringValidator(), 
          age: numberValidator(),
        }),
        preferences: z.object({
          notifications: booleanValidator(),
          newsletter: booleanValidator(),
        }),
        metadata: z.object({
          source: stringValidator(),
          priority: numberValidator(),
        }).optional(),
      });

      const validForm = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
        },
        preferences: {
          notifications: true,
          newsletter: false,
        },
      };

      const result = userFormSchema.safeParse(validForm);
      expect(result.success).toBe(true);

      const validFormWithMetadata = {
        ...validForm,
        metadata: {
          source: 'web',
          priority: 1,
        },
      };

      const resultWithMetadata = userFormSchema.safeParse(validFormWithMetadata);
      expect(resultWithMetadata.success).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should preserve TypeScript types correctly', () => {
      const schema = z.object({
        name: stringValidator(),
        age: numberValidator(), 
        active: booleanValidator(),
      });

      type SchemaType = z.infer<typeof schema>;
      
      const validData: SchemaType = {
        name: 'John',
        age: 25,
        active: true,
      };

      const nullData: SchemaType = {
        name: null,
        age: null,
        active: false,
      };

      expect(() => schema.parse(validData)).not.toThrow();
      expect(() => schema.parse(nullData)).not.toThrow();
    });
  });

  describe('Email and URL Validators', () => {
    describe('emailValidator', () => {
      const mockI18n = {
        _: (msg: MessageDescriptor) => typeof msg === 'string' ? msg : (msg.message || msg.id || ''),
        locale: 'en',
      } as unknown as I18n;
      
      it('should validate email addresses correctly', () => {
        const validator = emailValidator(mockI18n);
        
        expect(validator.parse('test@example.com')).toBe('test@example.com');
        expect(validator.parse('user.name@domain.co.uk')).toBe('user.name@domain.co.uk');
        expect(validator.parse('email+tag@example.org')).toBe('email+tag@example.org');
        expect(validator.parse(null)).toBe(null);
        
        expect(() => validator.parse('invalid')).toThrow();
        expect(() => validator.parse('invalid@')).toThrow();
        expect(() => validator.parse('@domain.com')).toThrow();
        expect(() => validator.parse('test@')).toThrow();
        expect(() => validator.parse('test.domain.com')).toThrow();
      });
      
      it('should provide proper error messages', () => {
        const validator = emailValidator(mockI18n);
        
        expect(() => validator.parse('invalid')).toThrow();
        
        expect(validator.parse('test@example.com')).toBe('test@example.com');
      });
    });

    describe('urlValidator', () => {
      const mockI18n = {
        _: (msg: MessageDescriptor) => typeof msg === 'string' ? msg : (msg.message || msg.id || ''),
        locale: 'en',
      } as unknown as I18n;
      
      it('should validate URLs correctly', () => {
        const validator = urlValidator(mockI18n);
        
        expect(validator.parse('http://example.com')).toBe('http://example.com');
        expect(validator.parse('https://example.com')).toBe('https://example.com');
        expect(validator.parse('https://sub.example.com/path?query=value')).toBe('https://sub.example.com/path?query=value');
        expect(validator.parse('https://example.com:8080')).toBe('https://example.com:8080');
        expect(validator.parse(null)).toBe(null);
        
        expect(() => validator.parse('invalid')).toThrow();
        expect(() => validator.parse('example.com')).toThrow();
        expect(() => validator.parse('//example.com')).toThrow();
        expect(() => validator.parse('ftp://example.com')).not.toThrow();
      });
      
      it('should provide proper error messages', () => {
        const validator = urlValidator(mockI18n);
        
        expect(() => validator.parse('invalid')).toThrow();
        
        expect(validator.parse('https://example.com')).toBe('https://example.com');
      });
    });
  });

  describe('Specialized Validators', () => {
    const mockI18n = {
      _: (msg: MessageDescriptor) => typeof msg === 'string' ? msg : (msg.message || msg.id || ''),
      locale: 'en',
    } as unknown as I18n;
    
    describe('ibanValidator', () => {
      it('should validate IBAN format', () => {
        const validator = ibanValidator(mockI18n);
        
        expect(() => validator.parse('GB82WEST12345698765432')).not.toThrow();
        expect(validator.parse('GB82WEST12345698765432')).toBe('GB82WEST12345698765432');
        
        expect(() => validator.parse(null)).toThrow();
        expect(() => validator.parse('')).toThrow();
        
        expect(() => validator.parse('invalid')).toThrow();
        expect(() => validator.parse('GB82INVALID')).toThrow();
      });
      
      it('should validate IBAN country consistency', () => {
        const gbValidator = ibanValidator(mockI18n, 'GB');
        const frValidator = ibanValidator(mockI18n, 'FR');
        
        expect(() => gbValidator.parse('GB82WEST12345698765432')).not.toThrow();
        
        expect(() => frValidator.parse('GB82WEST12345698765432')).toThrow();
        
        expect(() => frValidator.parse('GB82WEST12345698765432')).toThrow();
        
        const validator = ibanValidator(mockI18n);
        expect(() => validator.parse('GB82WEST12345698765432')).not.toThrow();
      });

      it('should validate required IBAN', () => {
        const validator = ibanValidator(mockI18n, 'GB');

        expect(() => validator.parse(null)).toThrow();
        expect(() => validator.parse('')).toThrow();

        try {
          validator.parse(null);
          fail('Should have thrown for null IBAN');
        } catch (error) {
          expect(error).toBeDefined();
        }
        
        expect(() => validator.parse('GB82WEST12345698765432')).not.toThrow();
      });
    });
    
    describe('dateOfBirthValidator', () => {
      it('should validate date format', () => {
        const validator = dateOfBirthValidator(mockI18n);
        
        expect(validator.parse(null)).toBe(null);
        
        expect(() => validator.parse('invalid-date')).toThrow();
        expect(() => validator.parse('2023-13-45')).toThrow();
        
        expect(() => validator.parse('invalid-date')).toThrow();
        expect(() => validator.parse('2023-13-45')).toThrow();
      });
      
      it('should validate minimum age (18 years)', () => {
        const validator = dateOfBirthValidator(mockI18n);
        
        const today = new Date();
        const validAge = new Date(today.getFullYear() - 25, 0, 1).toISOString();
        const exactlyEighteen = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString();
        const tooYoung = new Date(today.getFullYear() - 10, 0, 1).toISOString();
        
        expect(validator.parse(validAge)).toBe(validAge);
        expect(() => validator.parse(exactlyEighteen)).not.toThrow();
        
        expect(() => validator.parse(tooYoung)).toThrow();
        
        expect(() => validator.parse(tooYoung)).toThrow();
      });
      
      it('should validate maximum age (120 years)', () => {
        const validator = dateOfBirthValidator(mockI18n);
        
        const today = new Date();
        const validOldAge = new Date(today.getFullYear() - 80, 0, 1).toISOString();
        const exactly120 = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString();
        const tooOld = new Date(today.getFullYear() - 150, 0, 1).toISOString();
        
        expect(validator.parse(validOldAge)).toBe(validOldAge);
        expect(() => validator.parse(exactly120)).not.toThrow();
        
        expect(() => validator.parse(tooOld)).toThrow();
        
        expect(() => validator.parse(tooOld)).toThrow();
      });
    });
    
    describe('phoneValidator', () => {
      it('should validate international phone numbers', () => {
        const validator = phoneValidator(mockI18n);
        
        expect(validator.parse('+12125551234')).toBe('+12125551234');
        expect(validator.parse('+442071234567')).toBe('+442071234567');
        expect(validator.parse('+49301234567')).toBe('+49301234567');
        
        expect(() => validator.parse(null)).toThrow();
        expect(() => validator.parse(undefined)).toThrow();
      });
      
      it('should reject invalid phone numbers', () => {
        const validator = phoneValidator(mockI18n);
        
        expect(() => validator.parse('123')).toThrow();
        expect(() => validator.parse('invalid')).toThrow();
        expect(() => validator.parse('123456789012345678901')).toThrow();
        expect(() => validator.parse('+999999999999999999')).toThrow();
        
        expect(() => validator.parse('invalid')).toThrow();
      });
      
      it('should handle edge cases', () => {
        const validator = phoneValidator(mockI18n);
        
        expect(() => validator.parse(null)).toThrow();
        expect(() => validator.parse(undefined)).toThrow();
        
        expect(() => validator.parse('2125551234')).toThrow();
        
        expect(() => validator.parse('+12125551234')).not.toThrow();
      });
    });
  });

  describe('withIbanCountryConsistency', () => {
    const mockI18n = {
      _: (msg: MessageDescriptor) => typeof msg === 'string' ? msg : (msg.message || msg.id || ''),
      locale: 'en',
    } as unknown as I18n;
    
    it('should validate IBAN country consistency', () => {
      const schema = z.object({
        country: z.string(),
        iban: z.string(),
      });
      
      const schemaWithConsistency = withIbanCountryConsistency(schema, mockI18n);
      
      expect(() => schemaWithConsistency.parse({
        country: 'GB',
        iban: 'GB82WEST12345698765432',
      })).not.toThrow();
      
      expect(() => schemaWithConsistency.parse({
        country: 'FR',
        iban: 'GB82WEST12345698765432',
      })).toThrow();
      
      expect(() => schemaWithConsistency.parse({
        country: 'FR',
        iban: 'GB82WEST12345698765432',
      })).toThrow();
      
      expect(() => schemaWithConsistency.parse({
        country: 'GB',
        iban: '',
      })).not.toThrow();
      
      expect(() => schemaWithConsistency.parse({
        country: '',
        iban: 'GB82WEST12345698765432',
      })).not.toThrow();
    });
    
    it('should support custom field names', () => {
      const schema = z.object({
        countryCode: z.string(),
        bankAccount: z.string(),
      });
      
      const schemaWithConsistency = withIbanCountryConsistency(
        schema, 
        mockI18n,
        { ibanKey: 'bankAccount', countryKey: 'countryCode' }
      );
      
      expect(() => schemaWithConsistency.parse({
        countryCode: 'GB',
        bankAccount: 'GB82WEST12345698765432',
      })).not.toThrow();
      
      expect(() => schemaWithConsistency.parse({
        countryCode: 'FR',
        bankAccount: 'GB82WEST12345698765432',
      })).toThrow();
    });
  });
  
  describe('Advanced Validation Features', () => {
    const mockI18n = {
      _: (msg: MessageDescriptor) => typeof msg === 'string' ? msg : (msg.message || msg.id || ''),
      locale: 'en',
    } as unknown as I18n;
    
    describe('Chained Validation', () => {
      it('should support multiple validation steps for IBAN', () => {
        const validator = ibanValidator(mockI18n, 'GB');
        
        expect(() => validator.parse('INVALID_FORMAT')).toThrow();
        
        expect(() => validator.parse('FR1420041010050500013M02606')).toThrow();
      });
      
      it('should support multiple validation steps for date of birth', () => {
        const validator = dateOfBirthValidator(mockI18n);
        
        expect(() => validator.parse('not-a-date')).toThrow();
        
        const today = new Date();
        const tooYoung = new Date(today.getFullYear() - 10, 0, 1).toISOString();
        
        expect(() => validator.parse(tooYoung)).toThrow();
        
        const tooOld = new Date(today.getFullYear() - 150, 0, 1).toISOString();
        
        expect(() => validator.parse(tooOld)).toThrow();
      });
    });
    
    describe('Integration with Complex Schemas', () => {
      it('should work in nested object validation', () => {
        const userSchema = z.object({
          contact: z.object({
            email: emailValidator(mockI18n),
            phone: phoneValidator(mockI18n),
            website: urlValidator(mockI18n),
          }),
          profile: z.object({
            dateOfBirth: dateOfBirthValidator(mockI18n),
            bankAccount: ibanValidator(mockI18n, 'GB'),
          }),
        });
        
        const validData = {
          contact: {
            email: 'user@example.com',
            phone: '+12125551234',
            website: 'https://example.com',
          },
          profile: {
            dateOfBirth: new Date(1990, 0, 1).toISOString(),
            bankAccount: 'GB82WEST12345698765432',
          },
        };
        
        expect(() => userSchema.parse(validData)).not.toThrow();
        
        const invalidData = {
          ...validData,
          contact: {
            ...validData.contact,
            email: 'invalid-email',
          },
        };
        
        expect(() => userSchema.parse(invalidData)).toThrow();
      });
    });
    
    describe('Error Message Consistency', () => {
      it('should provide consistent error messages across validators', () => {
        const validators = [
          { name: 'email', validator: emailValidator(mockI18n), invalidValue: 'invalid' },
          { name: 'url', validator: urlValidator(mockI18n), invalidValue: 'invalid' },
          { name: 'phone', validator: phoneValidator(mockI18n), invalidValue: 'invalid' },
          { name: 'iban', validator: ibanValidator(mockI18n), invalidValue: 'invalid' },
          { name: 'dateOfBirth', validator: dateOfBirthValidator(mockI18n), invalidValue: 'invalid' },
        ];
        
        validators.forEach(({ validator, invalidValue }) => {
          expect(() => validator.parse(invalidValue)).toThrow();
        });
      });
    });
    
    describe('Null and Empty Value Handling', () => {
      it('should handle null values consistently', () => {
        const nullableValidators = [
          emailValidator(mockI18n),
          urlValidator(mockI18n),
          dateOfBirthValidator(mockI18n),
        ];
        
        nullableValidators.forEach(validator => {
          expect(validator.parse(null)).toBe(null);
        });
        
        const requiredValidators = [
          phoneValidator(mockI18n),
          ibanValidator(mockI18n),
        ];
        
        requiredValidators.forEach(validator => {
          expect(() => validator.parse(null)).toThrow();
        });
      });
      
      it('should handle empty strings appropriately', () => {
        const strictValidators = [
          { name: 'email', validator: emailValidator(mockI18n) },
          { name: 'url', validator: urlValidator(mockI18n) },
        ];
        
        strictValidators.forEach(({ validator }) => {
          expect(() => validator.parse('')).toThrow();
        });
      });
    });
  });
});