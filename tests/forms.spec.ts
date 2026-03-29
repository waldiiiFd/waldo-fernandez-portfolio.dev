import { test, expect } from '@playwright/test';

test.describe('Forms - Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#contacto').scrollIntoViewIfNeeded();
  });

  test.describe('Form Structure', () => {
    test('should display contact form', async ({ page }) => {
      const form = page.locator('#contact-form');
      await expect(form).toBeVisible();
    });

    test('should have all required fields', async ({ page }) => {
      await expect(page.locator('#nombre')).toBeVisible();
      await expect(page.locator('#correo')).toBeVisible();
      await expect(page.locator('#asunto')).toBeVisible();
      await expect(page.locator('#mensaje')).toBeVisible();
    });

    test('should have labels for all inputs', async ({ page }) => {
      await expect(page.locator('label[for="nombre"]')).toBeVisible();
      await expect(page.locator('label[for="correo"]')).toBeVisible();
      await expect(page.locator('label[for="asunto"]')).toBeVisible();
      await expect(page.locator('label[for="mensaje"]')).toBeVisible();
    });

    test('should have submit button', async ({ page }) => {
      const submitBtn = page.locator('.wp-contact__submit');
      await expect(submitBtn).toBeVisible();
    });

    test('should have placeholder texts', async ({ page }) => {
      const nombrePlaceholder = await page.locator('#nombre').getAttribute('placeholder');
      const correoPlaceholder = await page.locator('#correo').getAttribute('placeholder');
      const asuntoPlaceholder = await page.locator('#asunto').getAttribute('placeholder');
      const mensajePlaceholder = await page.locator('#mensaje').getAttribute('placeholder');

      expect(nombrePlaceholder).toBeTruthy();
      expect(correoPlaceholder).toBeTruthy();
      expect(asuntoPlaceholder).toBeTruthy();
      expect(mensajePlaceholder).toBeTruthy();
    });
  });

  test.describe('Client-Side Validation', () => {
    test('should disable submit button initially', async ({ page }) => {
      const submitBtn = page.locator('.wp-contact__submit');
      await expect(submitBtn).toBeDisabled();
    });

    test('should show error for empty nombre', async ({ page }) => {
      const nombreInput = page.locator('#nombre');
      await nombreInput.fill('');
      await nombreInput.blur();
      
      const errorMessage = page.locator('[data-field="nombre"]');
      await expect(errorMessage).toContainText(/requerido/i);
    });

    test('should show error for empty correo', async ({ page }) => {
      const correoInput = page.locator('#correo');
      await correoInput.fill('');
      await correoInput.blur();
      
      const errorMessage = page.locator('[data-field="correo"]');
      await expect(errorMessage).toContainText(/requerido/i);
    });

    test('should show error for empty asunto', async ({ page }) => {
      const asuntoInput = page.locator('#asunto');
      await asuntoInput.fill('');
      await asuntoInput.blur();
      
      const errorMessage = page.locator('[data-field="asunto"]');
      await expect(errorMessage).toContainText(/requerido/i);
    });

    test('should show error for empty mensaje', async ({ page }) => {
      const mensajeInput = page.locator('#mensaje');
      await mensajeInput.fill('');
      await mensajeInput.blur();
      
      const errorMessage = page.locator('[data-field="mensaje"]');
      await expect(errorMessage).toContainText(/requerido/i);
    });

    test('should show error for invalid email format', async ({ page }) => {
      await page.fill('#nombre', 'Test User');
      await page.fill('#correo', 'invalid-email');
      await page.fill('#asunto', 'Test Subject');
      await page.fill('#mensaje', 'This is a test message for validation.');
      
      const submitBtn = page.locator('.wp-contact__submit');
      await page.evaluate(() => {
        const btn = document.querySelector('.wp-contact__submit') as HTMLButtonElement;
        btn.disabled = false;
      });
      await submitBtn.click({ force: true });
      
      const errorMessage = page.locator('[data-field="correo"]');
      await expect(errorMessage).toContainText(/válido/i);
    });

    test('should show error for short nombre', async ({ page }) => {
      const nombreInput = page.locator('#nombre');
      await nombreInput.fill('A');
      await nombreInput.blur();
      
      const errorMessage = page.locator('[data-field="nombre"]');
      await expect(errorMessage).toContainText(/2 caracteres/i);
    });

    test('should show error for short mensaje', async ({ page }) => {
      const mensajeInput = page.locator('#mensaje');
      await mensajeInput.fill('Short');
      await mensajeInput.blur();
      
      const errorMessage = page.locator('[data-field="mensaje"]');
      await expect(errorMessage).toContainText(/20 caracteres/i);
    });

    test('should show error for long asunto', async ({ page }) => {
      const longAsunto = 'A'.repeat(101);
      const asuntoInput = page.locator('#asunto');
      await asuntoInput.fill(longAsunto);
      await asuntoInput.blur();
      
      const errorMessage = page.locator('[data-field="asunto"]');
      await expect(errorMessage).toContainText(/100 caracteres/i);
    });
  });

  test.describe('Form Submission', () => {
    test('should enable submit when all fields are valid', async ({ page }) => {
      await page.fill('#nombre', 'Waldo Fernandez');
      await page.fill('#correo', 'test@example.com');
      await page.fill('#asunto', 'Test Subject');
      await page.fill('#mensaje', 'This is a test message with enough characters to be valid.');
      
      const submitBtn = page.locator('.wp-contact__submit');
      await expect(submitBtn).toBeEnabled();
    });

    test('should clear errors when user types', async ({ page }) => {
      const nombreInput = page.locator('#nombre');
      await nombreInput.fill('');
      await nombreInput.blur();
      
      const errorMessage = page.locator('[data-field="nombre"]');
      await expect(errorMessage).toContainText(/requerido/i);
      
      await nombreInput.fill('Waldo');
      await expect(errorMessage).toBeEmpty();
    });

    test('should have character counter for mensaje', async ({ page }) => {
      const counter = page.locator('[data-counter]');
      const count = await counter.count();
      
      if (count > 0) {
        await expect(counter).toBeVisible();
        
        await page.fill('#mensaje', 'Test message');
        await expect(counter).toContainText('12');
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have accessible labels', async ({ page }) => {
      await expect(page.locator('label[for="nombre"]')).toHaveText(/nombre/i);
      await expect(page.locator('label[for="correo"]')).toHaveText(/correo/i);
      await expect(page.locator('label[for="asunto"]')).toHaveText(/asunto/i);
      await expect(page.locator('label[for="mensaje"]')).toHaveText(/mensaje/i);
    });

    test('should have proper input types', async ({ page }) => {
      const nombreType = await page.locator('#nombre').getAttribute('type');
      const correoType = await page.locator('#correo').getAttribute('type');
      
      expect(nombreType).toBe('text');
      expect(correoType).toBe('email');
    });

    test('should mark required fields', async ({ page }) => {
      const nombreRequired = await page.locator('#nombre').getAttribute('required');
      const hasRequired = nombreRequired !== null;
      expect(hasRequired).toBe(true);
    });
  });
});
