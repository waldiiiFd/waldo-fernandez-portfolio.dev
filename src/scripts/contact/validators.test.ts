import { describe, it, expect } from 'vitest';
import { validateField, isFieldValid, validators, type FieldName } from './validators.js';

describe('Contact Form Validators', () => {
  describe('validateField', () => {
    it('returns valid for correct nombre', () => {
      const result = validateField('nombre', 'Juan Pérez');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });

    it('rejects empty nombre', () => {
      const result = validateField('nombre', '');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('El nombre es requerido');
    });

    it('rejects nombre too short', () => {
      const result = validateField('nombre', 'J');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('El nombre debe tener al menos 2 caracteres');
    });

    it('rejects nombre with invalid characters', () => {
      const result = validateField('nombre', 'Juan123');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('El nombre solo puede contener letras y espacios');
    });

    it('returns valid for correct correo', () => {
      const result = validateField('correo', 'test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });

    it('rejects empty correo', () => {
      const result = validateField('correo', '');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('El correo electrónico es requerido');
    });

    it('rejects invalid correo format', () => {
      const result = validateField('correo', 'not-an-email');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Ingresa un correo electrónico válido');
    });

    it('returns valid for correct asunto', () => {
      const result = validateField('asunto', 'Hola mundo');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });

    it('rejects empty asunto', () => {
      const result = validateField('asunto', '');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('El asunto es requerido');
    });

    it('rejects asunto too short', () => {
      const result = validateField('asunto', 'Hola');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('El asunto debe tener al menos 5 caracteres');
    });

    it('rejects asunto too long', () => {
      const longAsunto = 'a'.repeat(101);
      const result = validateField('asunto', longAsunto);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('El asunto no puede exceder 100 caracteres');
    });

    it('returns valid for correct mensaje', () => {
      const result = validateField('mensaje', 'Este es un mensaje de prueba con suficiente longitud.');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });

    it('rejects empty mensaje', () => {
      const result = validateField('mensaje', '');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('El mensaje es requerido');
    });

    it('rejects mensaje too short', () => {
      const result = validateField('mensaje', 'Corto');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('El mensaje debe tener al menos 20 caracteres');
    });

    it('rejects mensaje too long', () => {
      const longMensaje = 'a'.repeat(501);
      const result = validateField('mensaje', longMensaje);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('El mensaje no puede exceder 500 caracteres');
    });

    it('returns valid for an unregistered field (defensive)', () => {
      const result = validateField('desconocido' as FieldName, 'cualquier valor');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });
  });

  describe('isFieldValid', () => {
    it('returns true for valid values', () => {
      expect(isFieldValid('nombre', 'Juan Pérez')).toBe(true);
      expect(isFieldValid('correo', 'test@example.com')).toBe(true);
      expect(isFieldValid('asunto', 'Hola mundo')).toBe(true);
      expect(isFieldValid('mensaje', 'Mensaje de prueba válido')).toBe(true);
    });

    it('returns false for invalid values', () => {
      expect(isFieldValid('nombre', '')).toBe(false);
      expect(isFieldValid('correo', 'invalid')).toBe(false);
      expect(isFieldValid('asunto', 'abc')).toBe(false);
      expect(isFieldValid('mensaje', 'corto')).toBe(false);
    });
  });

  describe('validators registry', () => {
    it('contains all four required validators', () => {
      expect(typeof validators.nombre).toBe('function');
      expect(typeof validators.correo).toBe('function');
      expect(typeof validators.asunto).toBe('function');
      expect(typeof validators.mensaje).toBe('function');
    });

    it('each validator returns ValidationResult', () => {
      const nombreResult = validators.nombre('Juan');
      expect(nombreResult).toHaveProperty('isValid');
      expect(nombreResult).toHaveProperty('errorMessage');
    });
  });
});