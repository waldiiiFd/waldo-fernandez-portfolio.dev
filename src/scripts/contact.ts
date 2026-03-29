import emailjs from "@emailjs/browser";

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

const initialState: FormState = {
  nombre: { value: "", touched: false, valid: false, errorMessage: "" },
  correo: { value: "", touched: false, valid: false, errorMessage: "" },
  asunto: { value: "", touched: false, valid: false, errorMessage: "" },
  mensaje: { value: "", touched: false, valid: false, errorMessage: "" },
  isSubmitting: false,
  submitted: false,
};

function validateNombre(value: string): string {
  if (!value.trim()) {
    return "El nombre es requerido";
  }
  if (value.trim().length < 2) {
    return "El nombre debe tener al menos 2 caracteres";
  }
  if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
    return "El nombre solo puede contener letras y espacios";
  }
  return "";
}

function validateCorreo(value: string): string {
  if (!value.trim()) {
    return "El correo electrónico es requerido";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    return "Ingresa un correo electrónico válido";
  }
  return "";
}

function validateAsunto(value: string): string {
  if (!value.trim()) {
    return "El asunto es requerido";
  }
  if (value.trim().length < 5) {
    return "El asunto debe tener al menos 5 caracteres";
  }
  if (value.trim().length > 100) {
    return "El asunto no puede exceder 100 caracteres";
  }
  return "";
}

function validateMensaje(value: string): string {
  if (!value.trim()) {
    return "El mensaje es requerido";
  }
  if (value.trim().length < 20) {
    return "El mensaje debe tener al menos 20 caracteres";
  }
  if (value.trim().length > 500) {
    return "El mensaje no puede exceder 500 caracteres";
  }
  return "";
}

function isFormValid(state: FormState): boolean {
  return (
    state.nombre.valid &&
    state.correo.valid &&
    state.asunto.valid &&
    state.mensaje.valid
  );
}

function getFieldState(fieldName: keyof FormState): FormField {
  const field = initialState[fieldName as keyof Omit<FormState, "isSubmitting" | "submitted">];
  return field as FormField;
}

function updateField(
  fieldName: keyof Pick<FormState, "nombre" | "correo" | "asunto" | "mensaje">,
  value: string
): void {
  let errorMessage = "";
  
  switch (fieldName) {
    case "nombre":
      errorMessage = validateNombre(value);
      break;
    case "correo":
      errorMessage = validateCorreo(value);
      break;
    case "asunto":
      errorMessage = validateAsunto(value);
      break;
    case "mensaje":
      errorMessage = validateMensaje(value);
      break;
  }

  const state = getFieldState(fieldName);
  state.value = value;
  state.touched = true;
  state.valid = errorMessage === "";
  state.errorMessage = errorMessage;

  const input = document.getElementById(fieldName) as HTMLInputElement | HTMLTextAreaElement;
  const errorEl = document.querySelector(`[data-field="${fieldName}"]`) as HTMLElement;

  if (input && errorEl) {
    if (!state.valid && state.touched) {
      input.classList.add("wp-contact__input--error", "wp-contact__textarea--error");
      errorEl.textContent = errorMessage;
    } else {
      input.classList.remove("wp-contact__input--error", "wp-contact__textarea--error");
      errorEl.textContent = "";
    }
  }

  updateSubmitButton();
}

function updateSubmitButton(): void {
  const submitBtn = document.querySelector(".wp-contact__submit") as HTMLButtonElement;
  if (submitBtn) {
    submitBtn.disabled = !isFormValid(initialState) || initialState.isSubmitting;
  }
}

function updateCounter(): void {
  const mensaje = initialState.mensaje.value;
  const counter = document.querySelector("[data-counter]") as HTMLElement;
  if (counter) {
    counter.textContent = mensaje.length.toString();
  }
}

function setLoadingState(isLoading: boolean): void {
  const submitBtn = document.querySelector(".wp-contact__submit") as HTMLButtonElement;
  const form = document.getElementById("contact-form") as HTMLFormElement;
  
  initialState.isSubmitting = isLoading;

  if (submitBtn) {
    if (isLoading) {
      submitBtn.classList.add("wp-contact__submit--loading");
    } else {
      submitBtn.classList.remove("wp-contact__submit--loading");
    }
    submitBtn.disabled = isLoading || !isFormValid(initialState);
  }

  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    (input as HTMLInputElement | HTMLTextAreaElement).disabled = isLoading;
  });
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

async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault();

  if (!isFormValid(initialState)) {
    return;
  }

  setLoadingState(true);
  clearFeedback();

  try {
    await emailjs.send(
      import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
      import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
      {
        from_name: initialState.nombre.value,
        from_email: initialState.correo.value,
        subject: initialState.asunto.value,
        message: initialState.mensaje.value,
      }
    );

    showFeedback("¡Mensaje enviado exitosamente! Te responderé pronto.", true);
    
    const form = document.getElementById("contact-form") as HTMLFormElement;
    form.reset();

    initialState.nombre = { value: "", touched: false, valid: false, errorMessage: "" };
    initialState.correo = { value: "", touched: false, valid: false, errorMessage: "" };
    initialState.asunto = { value: "", touched: false, valid: false, errorMessage: "" };
    initialState.mensaje = { value: "", touched: false, valid: false, errorMessage: "" };

    updateCounter();
    updateSubmitButton();
  } catch {
    showFeedback("Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo.", false);
  } finally {
    setLoadingState(false);
  }
}

function initContactForm(): void {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nombreInput = document.getElementById("nombre") as HTMLInputElement;
  const correoInput = document.getElementById("correo") as HTMLInputElement;
  const asuntoInput = document.getElementById("asunto") as HTMLInputElement;
  const mensajeInput = document.getElementById("mensaje") as HTMLTextAreaElement;

  nombreInput?.addEventListener("input", () => updateField("nombre", nombreInput.value));
  nombreInput?.addEventListener("blur", () => updateField("nombre", nombreInput.value));

  correoInput?.addEventListener("input", () => updateField("correo", correoInput.value));
  correoInput?.addEventListener("blur", () => updateField("correo", correoInput.value));

  asuntoInput?.addEventListener("input", () => updateField("asunto", asuntoInput.value));
  asuntoInput?.addEventListener("blur", () => updateField("asunto", asuntoInput.value));

  mensajeInput?.addEventListener("input", () => {
    updateField("mensaje", mensajeInput.value);
    updateCounter();
  });
  mensajeInput?.addEventListener("blur", () => updateField("mensaje", mensajeInput.value));

  form.addEventListener("submit", handleSubmit);

  if (typeof emailjs !== "undefined" && import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY) {
    emailjs.init({ publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY });
  }
}

function initContactAnimation(): void {
  // Animation is now handled globally by animations.ts
  // This function is kept for backwards compatibility but does nothing
  // to avoid conflicts with the main animation system
}

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
  initContactAnimation();
});
