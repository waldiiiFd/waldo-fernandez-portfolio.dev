import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('EmailService', () => {
  let mockSend: ReturnType<typeof vi.fn>;
  let mockInit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    mockSend = vi.fn().mockResolvedValue(undefined);
    mockInit = vi.fn().mockResolvedValue(undefined);

    vi.doMock('@emailjs/browser', () => ({
      default: {
        init: mockInit,
        send: mockSend,
      },
    }));
  });

  async function importModule(): Promise<typeof import('./email-service.js')> {
    return import('./email-service.js');
  }

  it('send() llama a emailjs.send(serviceId, templateId, params)', async () => {
    const { EmailJsService } = await importModule();
    const service = new EmailJsService({
      serviceId: 'test_service_id',
      templateId: 'test_template_id',
      publicKey: 'test_public_key',
    });

    const params = {
      from_name: 'Juan',
      from_email: 'juan@example.com',
      subject: 'Test Subject',
      message: 'Test message content',
    };

    await service.send(params);

    expect(mockSend).toHaveBeenCalledWith('test_service_id', 'test_template_id', params);
  });

  it('emailjs.init se llama con { publicKey } UNA sola vez tras dos send()', async () => {
    const { EmailJsService } = await importModule();
    const service = new EmailJsService({
      serviceId: 'test_service_id',
      templateId: 'test_template_id',
      publicKey: 'test_public_key',
    });

    const params = {
      from_name: 'Juan',
      from_email: 'juan@example.com',
      subject: 'Test Subject',
      message: 'Test message content',
    };

    await service.send(params);
    await service.send(params);

    expect(mockInit).toHaveBeenCalledTimes(1);
    expect(mockInit).toHaveBeenCalledWith({ publicKey: 'test_public_key' });
  });

  it('send() rechaza con error claro si falta serviceId, templateId o publicKey, y NO llama al SDK', async () => {
    const { EmailJsService } = await importModule();

    const serviceNoServiceId = new EmailJsService({
      templateId: 'test_template_id',
      publicKey: 'test_public_key',
    });
    const serviceNoTemplateId = new EmailJsService({
      serviceId: 'test_service_id',
      publicKey: 'test_public_key',
    });
    const serviceNoPublicKey = new EmailJsService({
      serviceId: 'test_service_id',
      templateId: 'test_template_id',
    });

    await expect(serviceNoServiceId.send({ from_name: 'a', from_email: 'b', subject: 'c', message: 'd' }))
      .rejects.toThrow('EmailJS no está configurado');
    expect(mockSend).not.toHaveBeenCalled();

    await expect(serviceNoTemplateId.send({ from_name: 'a', from_email: 'b', subject: 'c', message: 'd' }))
      .rejects.toThrow('EmailJS no está configurado');
    expect(mockSend).not.toHaveBeenCalled();

    await expect(serviceNoPublicKey.send({ from_name: 'a', from_email: 'b', subject: 'c', message: 'd' }))
      .rejects.toThrow('EmailJS no está configurado');
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('createEmailService() devuelve una instancia de EmailJsService', async () => {
    const { createEmailService, EmailJsService } = await importModule();
    const service = createEmailService();
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(EmailJsService);
    expect(typeof service.send).toBe('function');
  });
});