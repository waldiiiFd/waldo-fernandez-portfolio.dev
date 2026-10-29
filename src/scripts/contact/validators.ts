export const FIELD_NAMES = ['nombre', 'correo', 'asunto', 'mensaje'] as const;
export type FieldName = (typeof FIELD_NAMES)[number];

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

export type Validator = (value: string) => ValidationResult;

export type ValidatorRegistry = {
  [K in FieldName]: Validator;
};

function validateNombre(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, errorMessage: 'El nombre es requerido' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, errorMessage: 'El nombre debe tener al menos 2 caracteres' };
  }
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) {
    return { isValid: false, errorMessage: 'El nombre solo puede contener letras y espacios' };
  }
  return { isValid: true, errorMessage: '' };
}

function validateCorreo(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, errorMessage: 'El correo electrónico es requerido' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, errorMessage: 'Ingresa un correo electrónico válido' };
  }
  return { isValid: true, errorMessage: '' };
}

function validateAsunto(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, errorMessage: 'El asunto es requerido' };
  }
  if (trimmed.length < 5) {
    return { isValid: false, errorMessage: 'El asunto debe tener al menos 5 caracteres' };
  }
  if (trimmed.length > 100) {
    return { isValid: false, errorMessage: 'El asunto no puede exceder 100 caracteres' };
  }
  return { isValid: true, errorMessage: '' };
}

function validateMensaje(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, errorMessage: 'El mensaje es requerido' };
  }
  if (trimmed.length < 20) {
    return { isValid: false, errorMessage: 'El mensaje debe tener al menos 20 caracteres' };
  }
  if (trimmed.length > 500) {
    return { isValid: false, errorMessage: 'El mensaje no puede exceder 500 caracteres' };
  }
  return { isValid: true, errorMessage: '' };
}

export const validators: ValidatorRegistry = {
  nombre: validateNombre,
  correo: validateCorreo,
  asunto: validateAsunto,
  mensaje: validateMensaje,
};

export function validateField(fieldName: FieldName, value: string): ValidationResult {
  const validator = validators[fieldName];
  if (!validator) {
    return { isValid: true, errorMessage: '' };
  }
  return validator(value);
}

export function isFieldValid(fieldName: FieldName, value: string): boolean {
  return validateField(fieldName, value).isValid;
}