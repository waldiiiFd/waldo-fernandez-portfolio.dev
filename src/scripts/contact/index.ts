import { validateField, type FieldName, FIELD_NAMES } from "./validators.js";
import { createEmailService, type EmailService, type EmailParams } from "./email-service.js";

interface FormField {
  value: string;
  touched: boolean;
  valid: boolean;
  errorMessage: string;
}

interface FormState {
  nombre: FormField;
  correo: FormField;
  asunto: FormField;
  mensaje: FormField;
  isSubmitting: boolean;
  submitted: boolean;
}

function createInitialState(): FormState {
  return {
    nombre: { value: "", touched: false, valid: false, errorMessage: "" },
    correo: { value: "", touched: false, valid: false, errorMessage: "" },
    asunto: { value: "", touched: false, valid: false, errorMessage: "" },
    mensaje: { value: "", touched: false, valid: false, errorMessage: "" },
    isSubmitting: false,
    submitted: false,
  };
}

function isFormValid(state: FormState): boolean {
  return (
    state.nombre.valid &&
    state.correo.valid &&
    state.asunto.valid &&
    state.mensaje.valid
  );
}

function getFieldState(state: FormState, fieldName: FieldName): FormField {
  return state[fieldName];
}

function updateFieldUI(state: FormState, fieldName: FieldName): void {
  const fieldState = getFieldState(state, fieldName);
  const input = document.getElementById(fieldName) as HTMLInputElement | HTMLTextAreaElement;
  const errorEl = document.querySelector(`[data-field="${fieldName}"]`) as HTMLElement;

  if (input && errorEl) {
    if (!fieldState.valid && fieldState.touched) {
      input.classList.add("wp-contact__input--error", "wp-contact__textarea--error");
      errorEl.textContent = fieldState.errorMessage;
    } else {
      input.classList.remove("wp-contact__input--error", "wp-contact__textarea--error");
      errorEl.textContent = "";
    }
  }
}

function updateSubmitButton(state: FormState): void {
  const submitBtn = document.querySelector(".wp-contact__submit") as HTMLButtonElement;
  if (submitBtn) {
    submitBtn.disabled = !isFormValid(state) || state.isSubmitting;
  }
}

function updateCounter(state: FormState): void {
  const counter = document.querySelector("[data-counter]") as HTMLElement;
  if (counter) {
    counter.textContent = state.mensaje.value.length.toString();
  }
}

function setLoadingState(state: FormState, isLoading: boolean): void {
  state.isSubmitting = isLoading;

  const submitBtn = document.querySelector(".wp-contact__submit") as HTMLButtonElement;
  const form = document.getElementById("contact-form") as HTMLFormElement;

  if (submitBtn) {
    if (isLoading) {
      submitBtn.classList.add("wp-contact__submit--loading");
    } else {
      submitBtn.classList.remove("wp-contact__submit--loading");
    }
    submitBtn.disabled = isLoading || !isFormValid(state);
  }

  if (form) {
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      (input as HTMLInputElement | HTMLTextAreaElement).disabled = isLoading;
    });
  }
}

function showFeedback(message: string, isSuccess: boolean): void {
  const feedback = document.querySelector(".wp-contact__feedback") as HTMLElement;
  if (feedback) {
    feedback.textContent = message;
    feedback.className = "wp-contact__feedback";
    feedback.classList.add(isSuccess ? "wp-contact__feedback--success" : "wp-contact__feedback--error");
  }
}

function clearFeedback(): void {
  const feedback = document.querySelector(".wp-contact__feedback") as HTMLElement;
  if (feedback) {
    feedback.textContent = "";
    feedback.className = "wp-contact__feedback";
  }
}

function resetForm(state: FormState): void {
  Object.assign(state, createInitialState());
  const form = document.getElementById("contact-form") as HTMLFormElement;
  if (form) {
    form.reset();
  }
  updateCounter(state);
  updateSubmitButton(state);
  FIELD_NAMES.forEach((fieldName) => updateFieldUI(state, fieldName));
}

async function handleSubmit(state: FormState, emailService: EmailService, e: Event): Promise<void> {
  e.preventDefault();

  if (state.isSubmitting || !isFormValid(state)) {
    return;
  }

  setLoadingState(state, true);
  clearFeedback();

  try {
    const params: EmailParams = {
      from_name: state.nombre.value,
      from_email: state.correo.value,
      subject: state.asunto.value,
      message: state.mensaje.value,
    };

    await emailService.send(params);

    showFeedback("¡Mensaje enviado exitosamente! Te responderé pronto.", true);
    resetForm(state);
  } catch {
    showFeedback("Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo.", false);
  } finally {
    setLoadingState(state, false);
  }
}

function validateAndUpdate(state: FormState, fieldName: FieldName, input: HTMLInputElement | HTMLTextAreaElement): void {
  const result = validateField(fieldName, input.value);
  const fieldState = getFieldState(state, fieldName);
  fieldState.value = input.value;
  fieldState.touched = true;
  fieldState.valid = result.isValid;
  fieldState.errorMessage = result.errorMessage;

  updateFieldUI(state, fieldName);
  updateSubmitButton(state);

  if (fieldName === "mensaje") {
    updateCounter(state);
  }
}

function bindEvents(form: HTMLFormElement, state: FormState, emailService: EmailService): void {
  FIELD_NAMES.forEach((fieldName) => {
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${fieldName}`);
    if (input) {
      const handler = () => validateAndUpdate(state, fieldName, input);
      input.addEventListener("input", handler);
      input.addEventListener("blur", handler);
    }
  });

  form.addEventListener("submit", (e) => handleSubmit(state, emailService, e));
}

function initContactForm(): void {
  const form = document.getElementById("contact-form");
  if (!(form instanceof HTMLFormElement)) return;

  const state = createInitialState();
  const emailService = createEmailService();

  bindEvents(form, state, emailService);
}

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
});

export {};